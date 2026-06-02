import { Router } from "express";
import multer from "multer";
import OpenAI from "openai";
import { query } from "../lib/db.js";
import { objectStorage } from "../lib/objectStorage.js";
import { logger } from "../lib/logger.js";
import fs from "fs";
import path from "path";
import os from "os";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const PAYMENTS_ALLOWED = [
  "ngobesesimangaliso47@gmail.com",
  "mhlopheholdings@gmail.com",
];

function requirePaymentsAuth(req: any, res: any, next: any) {
  if (!req.session?.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!PAYMENTS_ALLOWED.includes(req.session.adminEmail)) {
    res.status(403).json({ error: "Access restricted to authorised administrators" });
    return;
  }
  next();
}

function getCurrentFortnight(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diffToSat = (day === 6) ? 0 : (day + 1);
  const thisSat = new Date(now);
  thisSat.setDate(now.getDate() - diffToSat);
  thisSat.setHours(14, 0, 0, 0);

  if (now < thisSat) {
    thisSat.setDate(thisSat.getDate() - 7);
  }

  const prevSat = new Date(thisSat);
  prevSat.setDate(thisSat.getDate() - 14);
  prevSat.setHours(14, 0, 0, 0);

  return { start: prevSat, end: thisSat };
}

const openaiClient = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

async function extractWithAI(text: string): Promise<Array<{
  agent_name: string;
  policy_number: string;
  client_name: string;
  amount: number;
}>> {
  const prompt = `You are extracting commission/payment data from an insurance statement.

Extract ALL entries from this document. Each entry should have:
- agent_name: the name of the insurance agent/broker
- policy_number: the policy number (can be alphanumeric)
- client_name: the name of the client/policyholder
- amount: the commission/payment amount as a number (no currency symbols)

Return a JSON array. Example:
[
  {"agent_name": "John Smith", "policy_number": "POL123456", "client_name": "Jane Doe", "amount": 1500.00},
  {"agent_name": "John Smith", "policy_number": "POL789012", "client_name": "Bob Jones", "amount": 750.50}
]

If a field is missing or unclear, use empty string for text fields and 0 for amount.
Return ONLY the JSON array, no other text.

Document content:
${text.slice(0, 12000)}`;

  const response = await openaiClient.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content ?? "[]";
  try {
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    logger.error({ content }, "Failed to parse AI extraction response");
    return [];
  }
}

async function extractWithAIFromImage(imageBuffer: Buffer, mimeType: string): Promise<Array<{
  agent_name: string;
  policy_number: string;
  client_name: string;
  amount: number;
}>> {
  const base64 = imageBuffer.toString("base64");
  const prompt = `You are extracting commission/payment data from an insurance statement image.

Extract ALL entries from this document. Each entry should have:
- agent_name: the name of the insurance agent/broker
- policy_number: the policy number (can be alphanumeric)
- client_name: the name of the client/policyholder
- amount: the commission/payment amount as a number (no currency symbols)

Return a JSON array. Example:
[
  {"agent_name": "John Smith", "policy_number": "POL123456", "client_name": "Jane Doe", "amount": 1500.00},
  {"agent_name": "John Smith", "policy_number": "POL789012", "client_name": "Bob Jones", "amount": 750.50}
]

If a field is missing or unclear, use empty string for text fields and 0 for amount.
Return ONLY the JSON array, no other text.`;

  const response = await openaiClient.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "[]";
  try {
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    logger.error({ content }, "Failed to parse AI image extraction response");
    return [];
  }
}

router.post("/commissions/upload", requirePaymentsAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  const { mimetype, originalname, buffer } = req.file;
  const isImage = mimetype.startsWith("image/");
  const isPDF = mimetype === "application/pdf";

  if (!isImage && !isPDF) {
    res.status(400).json({ error: "Only PDF or image files (JPG, PNG, etc.) are supported" });
    return;
  }

  try {
    const filePath = await objectStorage.uploadBuffer(originalname, mimetype, buffer);
    const fortnight = getCurrentFortnight();
    let entries: Array<{ agent_name: string; policy_number: string; client_name: string; amount: number }> = [];

    if (isImage) {
      entries = await extractWithAIFromImage(buffer, mimetype);
    } else {
      let rawText = "";
      try {
        const tmpFile = path.join(os.tmpdir(), `stmt-${Date.now()}.pdf`);
        fs.writeFileSync(tmpFile, buffer);
        const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
        const data = await pdfParse(buffer);
        rawText = data.text;
        fs.unlinkSync(tmpFile);
      } catch (err) {
        logger.warn({ err }, "PDF text extraction failed, falling back to image vision");
        entries = await extractWithAIFromImage(buffer, "application/pdf");
      }
      if (rawText.trim().length > 50) {
        entries = await extractWithAI(rawText);
      } else if (entries.length === 0) {
        entries = await extractWithAIFromImage(buffer, mimetype);
      }
    }

    const stmtResult = await query(
      `INSERT INTO commission_statements (uploaded_by, file_name, file_path, fortnight_start, fortnight_end)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.session.adminEmail, originalname, filePath, fortnight.start, fortnight.end]
    );
    const statementId = stmtResult.rows[0].id;

    for (const entry of entries) {
      if (!entry.agent_name) continue;
      await query(
        `INSERT INTO commission_entries (statement_id, agent_name, policy_number, client_name, amount, fortnight_start, fortnight_end)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [statementId, entry.agent_name, entry.policy_number || "", entry.client_name || "", entry.amount || 0, fortnight.start, fortnight.end]
      );
    }

    req.log.info({ statementId, entryCount: entries.length }, "Commission statement uploaded and parsed");
    res.json({ success: true, statementId, entryCount: entries.length, fortnight });
  } catch (err) {
    req.log.error({ err }, "Failed to process commission statement");
    res.status(500).json({ error: "Failed to process file" });
  }
});

router.get("/commissions/summary", requirePaymentsAuth, async (req, res) => {
  const { fortnightStart } = req.query as { fortnightStart?: string };

  let start: Date, end: Date;
  if (fortnightStart) {
    start = new Date(fortnightStart);
    end = new Date(start);
    end.setDate(end.getDate() + 14);
  } else {
    const fn = getCurrentFortnight();
    start = fn.start;
    end = fn.end;
  }

  try {
    const agentTotals = await query(
      `SELECT agent_name, SUM(amount) as total_amount, COUNT(*) as policy_count
       FROM commission_entries
       WHERE fortnight_start >= $1 AND fortnight_start < $2
       GROUP BY agent_name
       ORDER BY total_amount DESC`,
      [start, end]
    );

    const allEntries = await query(
      `SELECT ce.*, cs.file_name, cs.uploaded_by, cs.created_at as statement_uploaded_at
       FROM commission_entries ce
       JOIN commission_statements cs ON ce.statement_id = cs.id
       WHERE ce.fortnight_start >= $1 AND ce.fortnight_start < $2
       ORDER BY ce.agent_name, ce.created_at DESC`,
      [start, end]
    );

    const statements = await query(
      `SELECT id, file_name, uploaded_by, fortnight_start, fortnight_end, created_at
       FROM commission_statements
       WHERE fortnight_start >= $1 AND fortnight_start < $2
       ORDER BY created_at DESC`,
      [start, end]
    );

    res.json({
      fortnight: { start, end },
      agentTotals: agentTotals.rows,
      entries: allEntries.rows,
      statements: statements.rows,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch commission summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.get("/commissions/fortnights", requirePaymentsAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT fortnight_start, fortnight_end
       FROM commission_statements
       ORDER BY fortnight_start DESC
       LIMIT 24`,
      []
    );
    res.json({ fortnights: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch fortnights");
    res.status(500).json({ error: "Failed to fetch fortnights" });
  }
});

router.delete("/commissions/entries/:id", requirePaymentsAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM commission_entries WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete commission entry");
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

router.delete("/commissions/statements/:id", requirePaymentsAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM commission_statements WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete statement");
    res.status(500).json({ error: "Failed to delete statement" });
  }
});

export default router;
