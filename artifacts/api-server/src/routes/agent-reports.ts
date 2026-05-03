import { Router } from "express";
import { query } from "../lib/db.js";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.adminEmail) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/agent-reports", requireAuth, async (req, res) => {
  const { agentCount, province, period, notes } = req.body as {
    agentCount: number; province: string; period: string; notes?: string;
  };

  if (!agentCount || !province || !period) {
    res.status(400).json({ error: "agentCount, province, and period are required" });
    return;
  }

  if (typeof agentCount !== "number" || agentCount < 0) {
    res.status(400).json({ error: "agentCount must be a non-negative number" });
    return;
  }

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO agent_reports (submitted_by, agent_count, province, period, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [req.session.adminEmail, agentCount, province, period, notes ?? null]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    req.log.error({ err }, "Failed to submit agent report");
    res.status(500).json({ error: "Failed to submit report" });
  }
});

router.get("/agent-reports", requireAuth, async (req, res) => {
  try {
    const result = await query<{
      id: number; submitted_by: string; agent_count: number;
      province: string; period: string; notes: string | null; created_at: string;
    }>(
      `SELECT id, submitted_by, agent_count, province, period, notes, created_at
       FROM agent_reports
       ORDER BY created_at DESC`
    );
    res.json({ reports: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch agent reports");
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.delete("/agent-reports/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const result = await query(
      "DELETE FROM agent_reports WHERE id = $1 AND submitted_by = $2 RETURNING id",
      [id, req.session.adminEmail]
    );
    if (result.rowCount === 0) {
      res.status(403).json({ error: "Not authorised to delete this report" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete agent report");
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
