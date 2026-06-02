import { Router } from "express";
import multer from "multer";
import OpenAI from "openai";
import { createRequire } from "module";
import { query } from "../lib/db.js";
import { objectStorage } from "../lib/objectStorage.js";
import { logger } from "../lib/logger.js";

const require = createRequire(import.meta.url);

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const PAYMENTS_ALLOWED = [
  "ngobesesimangaliso47@gmail.com",
  "mhlopheholdings@gmail.com",
];

function requirePaymentsAuth(req: any, res: any, next: any) {
  if (!req.session?.adminEmail) { res.status(401).json({ error: "Not authenticated" }); return; }
  if (!PAYMENTS_ALLOWED.includes(req.session.adminEmail)) { res.status(403).json({ error: "Access restricted" }); return; }
  next();
}

const openaiClient = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

async function extractWithAI(text: string) {
  const prompt = `Extract ALL commission/payment entries from this insurance statement text.
Return a JSON array where each item has:
- agent_name (string)
- policy_number (string, can be empty)
- client_name (string, can be empty)
- amount (number, no currency symbols)

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
    return JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
  } catch {
    logger.error({ content }, "Failed to parse AI extraction response");
    return [];
  }
}

async function extractWithAIFromImage(imageBuffer: Buffer, mimeType: string) {
  const base64 = imageBuffer.toString("base64");
  const prompt = `Extract ALL commission/payment entries from this insurance statement image.
Return a JSON array where each item has:
- agent_name (string)
- policy_number (string, can be empty)
- client_name (string, can be empty)
- amount (number, no currency symbols)
Return ONLY the JSON array, no other text.`;

  const response = await openaiClient.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
      ],
    }],
  });
  const content = response.choices[0]?.message?.content ?? "[]";
  try {
    return JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
  } catch {
    logger.error({ content }, "Failed to parse AI image extraction");
    return [];
  }
}

// ─── PERIOD CRUD ───────────────────────────────────────────────────────────

router.get("/commissions/periods", requirePaymentsAuth, async (req, res) => {
  try {
    const result = await query(`
      SELECT cp.*,
        COUNT(DISTINCT cs.id) AS statement_count,
        COUNT(ce.id) AS entry_count,
        COALESCE(SUM(ce.amount), 0) AS total_amount
      FROM commission_periods cp
      LEFT JOIN commission_statements cs ON cs.period_id = cp.id
      LEFT JOIN commission_entries ce ON ce.statement_id = cs.id
      GROUP BY cp.id
      ORDER BY cp.period_start DESC
    `, []);
    res.json({ periods: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch periods");
    res.status(500).json({ error: "Failed to fetch periods" });
  }
});

router.post("/commissions/periods", requirePaymentsAuth, async (req, res) => {
  const { label, period_start, period_end } = req.body;
  if (!label || !period_start || !period_end) {
    res.status(400).json({ error: "label, period_start and period_end are required" });
    return;
  }
  if (new Date(period_start) >= new Date(period_end)) {
    res.status(400).json({ error: "Start date must be before end date" });
    return;
  }
  try {
    const result = await query(
      `INSERT INTO commission_periods (label, period_start, period_end, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [label.trim(), period_start, period_end, req.session.adminEmail]
    );
    res.json({ period: result.rows[0] });
  } catch (err) {
    req.log.error({ err }, "Failed to create period");
    res.status(500).json({ error: "Failed to create period" });
  }
});

router.put("/commissions/periods/:id", requirePaymentsAuth, async (req, res) => {
  const { id } = req.params;
  const { label, period_start, period_end, action, payment_date, notes } = req.body;

  try {
    // Check period exists and is not already finalised (unless we're just editing a finalised one)
    const existing = await query("SELECT * FROM commission_periods WHERE id = $1", [id]);
    if (!existing.rows[0]) { res.status(404).json({ error: "Period not found" }); return; }
    const period = existing.rows[0];

    if (action === "finalise") {
      if (period.status === "finalised") {
        res.status(400).json({ error: "Period is already finalised" });
        return;
      }
      const pd = payment_date || new Date().toISOString();
      const result = await query(
        `UPDATE commission_periods
         SET status = 'finalised', payment_date = $1, finalised_by = $2, finalised_at = NOW(), notes = COALESCE($3, notes)
         WHERE id = $4 RETURNING *`,
        [pd, req.session.adminEmail, notes || null, id]
      );
      res.json({ period: result.rows[0] });
      return;
    }

    if (action === "reopen") {
      const result = await query(
        `UPDATE commission_periods
         SET status = 'active', payment_date = NULL, finalised_by = NULL, finalised_at = NULL
         WHERE id = $1 RETURNING *`,
        [id]
      );
      res.json({ period: result.rows[0] });
      return;
    }

    // Default: update label/dates
    if (period.status === "finalised") {
      res.status(400).json({ error: "Cannot edit dates of a finalised period. Reopen it first." });
      return;
    }
    if (period_start && period_end && new Date(period_start) >= new Date(period_end)) {
      res.status(400).json({ error: "Start date must be before end date" });
      return;
    }
    const result = await query(
      `UPDATE commission_periods
       SET label = COALESCE($1, label),
           period_start = COALESCE($2, period_start),
           period_end = COALESCE($3, period_end),
           notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [label ?? null, period_start ?? null, period_end ?? null, notes ?? null, id]
    );
    res.json({ period: result.rows[0] });
  } catch (err) {
    req.log.error({ err }, "Failed to update period");
    res.status(500).json({ error: "Failed to update period" });
  }
});

router.delete("/commissions/periods/:id", requirePaymentsAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM commission_periods WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete period");
    res.status(500).json({ error: "Failed to delete period" });
  }
});

// ─── UPLOAD ────────────────────────────────────────────────────────────────

router.post("/commissions/upload", requirePaymentsAuth, upload.single("file"), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file provided" }); return; }

  const { mimetype, originalname, buffer } = req.file;
  const { period_id } = req.body;
  const isImage = mimetype.startsWith("image/");
  const isPDF = mimetype === "application/pdf";

  if (!isImage && !isPDF) {
    res.status(400).json({ error: "Only PDF or image files are supported" });
    return;
  }
  if (!period_id) {
    res.status(400).json({ error: "A period must be selected before uploading" });
    return;
  }

  // Verify period exists
  const periodCheck = await query("SELECT * FROM commission_periods WHERE id = $1", [period_id]);
  if (!periodCheck.rows[0]) { res.status(404).json({ error: "Period not found" }); return; }
  if (periodCheck.rows[0].status === "finalised") {
    res.status(400).json({ error: "Cannot upload to a finalised period" });
    return;
  }
  const period = periodCheck.rows[0];

  try {
    let entries: Array<{ agent_name: string; policy_number: string; client_name: string; amount: number }> = [];

    if (isImage) {
      entries = await extractWithAIFromImage(buffer, mimetype);
    } else {
      let rawText = "";
      try {
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        rawText = data.text ?? "";
      } catch (err) {
        logger.warn({ err }, "PDF text extraction failed");
      }
      if (rawText.trim().length > 50) {
        entries = await extractWithAI(rawText);
      } else {
        const hint = buffer.toString("latin1").slice(0, 4000).replace(/[\x00-\x1F\x7F-\x9F]/g, " ");
        entries = await extractWithAI(`[PDF binary — extract any readable commission data]\n${hint}`);
      }
    }

    let filePath = `statements/${Date.now()}-${encodeURIComponent(originalname)}`;
    try {
      filePath = await objectStorage.uploadBuffer(originalname, mimetype, buffer);
    } catch (err) {
      logger.warn({ err }, "Object storage upload failed — using fallback path");
    }

    const stmtResult = await query(
      `INSERT INTO commission_statements (uploaded_by, file_name, file_path, fortnight_start, fortnight_end, period_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.session.adminEmail, originalname, filePath, period.period_start, period.period_end, period_id]
    );
    const statementId = stmtResult.rows[0].id;

    for (const entry of entries) {
      if (!entry.agent_name) continue;
      await query(
        `INSERT INTO commission_entries (statement_id, agent_name, policy_number, client_name, amount, fortnight_start, fortnight_end)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [statementId, entry.agent_name, entry.policy_number || "", entry.client_name || "", entry.amount || 0, period.period_start, period.period_end]
      );
    }

    req.log.info({ statementId, entryCount: entries.length, period_id }, "Commission statement uploaded");
    res.json({ success: true, statementId, entryCount: entries.length });
  } catch (err) {
    req.log.error({ err }, "Failed to process commission statement");
    res.status(500).json({ error: "Failed to process file" });
  }
});

// ─── SUMMARY ───────────────────────────────────────────────────────────────

router.get("/commissions/summary/:periodId", requirePaymentsAuth, async (req, res) => {
  const { periodId } = req.params;
  try {
    const periodResult = await query("SELECT * FROM commission_periods WHERE id = $1", [periodId]);
    if (!periodResult.rows[0]) { res.status(404).json({ error: "Period not found" }); return; }
    const period = periodResult.rows[0];

    const agentTotals = await query(`
      SELECT ce.agent_name,
        SUM(ce.amount) AS total_amount,
        COUNT(*) AS policy_count
      FROM commission_entries ce
      JOIN commission_statements cs ON ce.statement_id = cs.id
      WHERE cs.period_id = $1
      GROUP BY ce.agent_name
      ORDER BY total_amount DESC
    `, [periodId]);

    const allEntries = await query(`
      SELECT ce.*, cs.file_name, cs.uploaded_by, cs.created_at AS statement_uploaded_at
      FROM commission_entries ce
      JOIN commission_statements cs ON ce.statement_id = cs.id
      WHERE cs.period_id = $1
      ORDER BY ce.agent_name, ce.created_at DESC
    `, [periodId]);

    const statements = await query(`
      SELECT id, file_name, uploaded_by, created_at
      FROM commission_statements
      WHERE period_id = $1
      ORDER BY created_at DESC
    `, [periodId]);

    res.json({
      period,
      agentTotals: agentTotals.rows,
      entries: allEntries.rows,
      statements: statements.rows,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch commission summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// ─── ENTRY / STATEMENT DELETE ───────────────────────────────────────────────

router.delete("/commissions/entries/:id", requirePaymentsAuth, async (req, res) => {
  try {
    await query("DELETE FROM commission_entries WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete entry");
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

router.delete("/commissions/statements/:id", requirePaymentsAuth, async (req, res) => {
  try {
    await query("DELETE FROM commission_statements WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete statement");
    res.status(500).json({ error: "Failed to delete statement" });
  }
});

export default router;
