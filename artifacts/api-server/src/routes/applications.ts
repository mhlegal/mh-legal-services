import { Router } from "express";
import { query } from "../lib/db.js";
import { sendApplicationNotification } from "../lib/email.js";
import { objectStorage } from "../lib/objectStorage.js";
import { logger } from "../lib/logger.js";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

router.post("/applications/upload-url", async (req, res) => {
  const { fileName, contentType } = req.body as { fileName: string; contentType: string };
  if (!fileName || !contentType) {
    res.status(400).json({ error: "fileName and contentType are required" });
    return;
  }
  try {
    const result = await objectStorage.getPresignedPutURL(fileName, contentType);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to generate upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.post("/applications", async (req, res) => {
  const {
    fullNames,
    saIdNumber,
    physicalAddress,
    email,
    stipendStatus,
    province,
    trainingLetterPath,
  } = req.body as {
    fullNames: string;
    saIdNumber: string;
    physicalAddress: string;
    email: string;
    stipendStatus: boolean;
    province: string;
    trainingLetterPath?: string;
  };

  if (!fullNames || !saIdNumber || !physicalAddress || !email) {
    res.status(400).json({ error: "All required fields must be filled" });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO student_applications
        (full_names, sa_id_number, physical_address, email, stipend_status, province, training_letter_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [fullNames, saIdNumber, physicalAddress, email, stipendStatus, province, trainingLetterPath ?? null]
    );

    const id = result.rows[0].id;

    sendApplicationNotification({
      fullNames,
      saIdNumber,
      email,
      province,
      stipendStatus,
      trainingLetterPath,
    }).catch((err) => logger.error({ err }, "Failed to send application notification"));

    res.status(201).json({ success: true, id });
  } catch (err) {
    req.log.error({ err }, "Failed to save application");
    res.status(500).json({ error: "Failed to save application" });
  }
});

router.get("/applications", requireAuth, async (req, res) => {
  const { province, stipend } = req.query as { province?: string; stipend?: string };

  let sql = "SELECT * FROM student_applications WHERE 1=1";
  const params: unknown[] = [];

  if (province && province !== "all") {
    params.push(province);
    sql += ` AND province = $${params.length}`;
  }

  if (stipend === "yes") {
    sql += " AND stipend_status = true";
  } else if (stipend === "no") {
    sql += " AND stipend_status = false";
  }

  sql += " ORDER BY created_at DESC";

  try {
    const result = await query(sql, params);
    res.json({ applications: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch applications");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.get("/applications/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("SELECT * FROM student_applications WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch application" );
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

router.get("/applications/:id/letter", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "SELECT training_letter_path FROM student_applications WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0 || !result.rows[0].training_letter_path) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    const { stream, contentType } = await objectStorage.downloadObject(result.rows[0].training_letter_path);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="training-letter-${id}"`);
    stream.pipe(res);
  } catch (err) {
    req.log.error({ err }, "Failed to serve letter");
    res.status(500).json({ error: "Failed to serve file" });
  }
});

export default router;
