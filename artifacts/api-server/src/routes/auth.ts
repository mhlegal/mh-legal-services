import { Router } from "express";
import type { Request, Response } from "express";
import { randomBytes } from "crypto";
import { query } from "../lib/db.js";
import { sendSecurityAlert, sendPasswordReset } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

const AUTHORIZED_EMAILS = [
  "ngobesesimangaliso47@gmail.com",
  "mhlopheholdings@gmail.com",
  "phirid871@gmail.com",
  "bongisiphoandile2@gmail.com",
];
const MASTER_ADMIN = "ngobesesimangaliso47@gmail.com";

// ─── Bootstrap tables needed for password management ──────────────────────
async function ensurePasswordTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `, []);
  await query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `, []);
}
ensurePasswordTables().catch((err) => logger.error({ err }, "Failed to create password tables"));

// ─── Helper: get the current admin password (DB override takes priority) ──
async function getAdminPassword(): Promise<string> {
  try {
    const result = await query<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = 'admin_password'",
      []
    );
    if (result.rows[0]?.value) return result.rows[0].value;
  } catch {
    // fall through to env var
  }
  return process.env.ADMIN_PASSWORD ?? "";
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!AUTHORIZED_EMAILS.includes(normalizedEmail)) {
    req.log.warn({ email: normalizedEmail }, "Unauthorized login attempt");
    res.status(401).json({ error: "Unauthorized email address" });
    return;
  }

  const currentPassword = await getAdminPassword();
  if (!currentPassword || password !== currentPassword) {
    req.log.warn({ email: normalizedEmail }, "Invalid password attempt");
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const isMasterAdmin = normalizedEmail === MASTER_ADMIN;
  const ipAddress = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";

  req.session.adminEmail = normalizedEmail;
  req.session.isMasterAdmin = isMasterAdmin;

  try {
    await query(
      "INSERT INTO audit_log (admin_email, action, ip_address) VALUES ($1, $2, $3)",
      [normalizedEmail, "LOGIN", ipAddress]
    );
  } catch (err) {
    logger.error({ err }, "Failed to write audit log");
  }

  if (!isMasterAdmin) {
    sendSecurityAlert(normalizedEmail, ipAddress).catch((err) =>
      logger.error({ err }, "Failed to send security alert")
    );
  }

  res.json({
    success: true,
    email: normalizedEmail,
    isMasterAdmin,
  });
});

// ─── LOGOUT ────────────────────────────────────────────────────────────────

router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      req.log.error({ err }, "Session destroy failed");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// ─── ME ────────────────────────────────────────────────────────────────────

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

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────
// Accepts an authorized email, generates a 15-minute reset token, and emails
// a reset link. Always returns 200 regardless of whether the email is valid
// (prevents email enumeration).

router.post("/auth/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Silently succeed for unrecognized emails (prevents enumeration)
  if (!AUTHORIZED_EMAILS.includes(normalizedEmail)) {
    req.log.warn({ email: normalizedEmail }, "Forgot-password request for unknown email");
    res.json({ success: true });
    return;
  }

  try {
    // Clean up expired/used tokens for this email first
    await query(
      "DELETE FROM password_reset_tokens WHERE email = $1 AND (expires_at < NOW() OR used = TRUE)",
      [normalizedEmail]
    );

    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await query(
      "INSERT INTO password_reset_tokens (token, email, expires_at) VALUES ($1, $2, $3)",
      [token, normalizedEmail, expiresAt.toISOString()]
    );

    // Build reset URL from the incoming request (works on Vercel and locally)
    const origin = req.get("origin") ?? `${req.protocol}://${req.get("host")}`;
    const resetURL = `${origin}/reset-password?token=${token}`;

    await sendPasswordReset(normalizedEmail, resetURL);
    req.log.info({ email: normalizedEmail }, "Password reset email sent");
  } catch (err) {
    req.log.error({ err }, "Failed to process forgot-password request");
    // Still return 200 — don't leak internal errors
  }

  res.json({ success: true });
});

// ─── RESET PASSWORD ────────────────────────────────────────────────────────

router.post("/auth/reset-password", async (req: Request, res: Response) => {
  const { token, password } = req.body as { token: string; password: string };

  if (!token || !password) {
    res.status(400).json({ error: "Token and password are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  try {
    const result = await query<{ email: string; expires_at: string; used: boolean }>(
      "SELECT email, expires_at, used FROM password_reset_tokens WHERE token = $1",
      [token]
    );

    const row = result.rows[0];

    if (!row) {
      res.status(400).json({ error: "Invalid or expired reset link" });
      return;
    }

    if (row.used) {
      res.status(400).json({ error: "This reset link has already been used" });
      return;
    }

    if (new Date(row.expires_at) < new Date()) {
      res.status(400).json({ error: "This reset link has expired. Please request a new one." });
      return;
    }

    // Update or insert the admin password in app_settings (all managers share it)
    await query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('admin_password', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [password]
    );

    // Mark token as used
    await query("UPDATE password_reset_tokens SET used = TRUE WHERE token = $1", [token]);

    req.log.info({ email: row.email }, "Admin password reset successfully");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to reset password");
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
