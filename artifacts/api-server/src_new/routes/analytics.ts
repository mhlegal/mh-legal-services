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

router.post("/analytics/track", async (req, res) => {
  const { path } = req.body as { path?: string };
  if (!path) { res.status(400).json({ error: "path required" }); return; }
  try {
    await query("INSERT INTO page_visits (path) VALUES ($1)", [path]);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to track page visit");
    res.status(500).json({ error: "Failed to track" });
  }
});

router.get("/analytics/traffic", requireAuth, async (req, res) => {
  try {
    const totalsRes = await query<{ path: string; count: string }>(
      `SELECT path, COUNT(*) AS count FROM page_visits GROUP BY path ORDER BY count DESC`
    );

    const dailyRes = await query<{ day: string; count: string }>(
      `SELECT DATE_TRUNC('day', visited_at)::date AS day, COUNT(*) AS count
       FROM page_visits
       WHERE visited_at >= NOW() - INTERVAL '30 days'
       GROUP BY day
       ORDER BY day ASC`
    );

    const recentRes = await query<{ path: string; visited_at: string }>(
      `SELECT path, visited_at FROM page_visits ORDER BY visited_at DESC LIMIT 50`
    );

    const totalVisits = totalsRes.rows.reduce((sum, r) => sum + parseInt(r.count), 0);

    res.json({
      totalVisits,
      byPage: totalsRes.rows.map((r) => ({ path: r.path, count: parseInt(r.count) })),
      daily: dailyRes.rows.map((r) => ({ day: r.day, count: parseInt(r.count) })),
      recent: recentRes.rows,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch traffic stats");
    res.status(500).json({ error: "Failed to fetch traffic" });
  }
});

export default router;
