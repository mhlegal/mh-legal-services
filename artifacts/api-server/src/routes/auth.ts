import { Router } from "express";
import type { Request, Response } from "express";
import { query } from "../lib/db.js";
import { logger } from "../lib/logger.js";

const router = Router();

const AUTHORIZED_EMAILS = [
  "ngobesesimangaliso47@gmail.com",
  "mhlopheholdings@gmail.com",
  "phirid871@gmail.com",
  "bongisiphoandile2@gmail.com",
];

const MASTER_ADMIN = "ngobesesimangaliso47@gmail.com";

async function getAdminPassword(): Promise<string> {
  try {
    const result = await query<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = 'admin_password'",
      []
    );
    if (result.rows[0]?.value) return result.rows[0].value;
  } catch {
    // table may not exist yet — fall through to env var
  }
  return process.env.ADMIN_PASSWORD ?? "";
}

// POST /api/auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!AUTHORIZED_EMAILS.includes(normalizedEmail)) {
    logger.warn({ email: normalizedEmail }, "Unauthorized login attempt");
    res.status(401).json({ error: "Unauthorized email address" });
    return;
  }

  const currentPassword = await getAdminPassword();
  if (!currentPassword || password !== currentPassword) {
    logger.warn({ email: normalizedEmail }, "Invalid password attempt");
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const isMasterAdmin = normalizedEmail === MASTER_ADMIN;
  req.session.adminEmail = normalizedEmail;
  req.session.isMasterAdmin = isMasterAdmin;

  // Best-effort audit log (table may not exist on a fresh DB)
  try {
    const ip =
      req.headers["x-forwarded-for"]?.toString() ??
      req.socket.remoteAddress ??
      "unknown";
    await query(
      `CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        admin_email TEXT NOT NULL,
        action TEXT NOT NULL,
        ip_address TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      []
    );
    await query(
      "INSERT INTO audit_log (admin_email, action, ip_address) VALUES ($1, $2, $3)",
      [normalizedEmail, "LOGIN", ip]
    );
  } catch (err) {
    logger.error({ err }, "Failed to write audit log");
  }

  logger.info({ email: normalizedEmail }, "Manager logged in");
  res.json({ email: normalizedEmail, isMasterAdmin });
});

// POST /api/auth/logout
router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "Session destroy failed");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("mhlegal.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get("/auth/me", (req: Request, res: Response) => {
  if (!req.session.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({
    email: req.session.adminEmail,
    isMasterAdmin: req.session.isMasterAdmin ?? false,
  });
});

export default router;
