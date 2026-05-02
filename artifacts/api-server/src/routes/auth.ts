import { Router } from "express";
import { query } from "../lib/db.js";
import { sendSecurityAlert } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

const AUTHORIZED_EMAILS = [
  "ngobesesimangaliso47@gmail.com",
  "mhlopheholdings@gmail.com",
  "phirid871@gmail.com",
  "bongisiphoandile2@gmail.com",
];
const MASTER_ADMIN = "ngobesesimangaliso47@gmail.com";

router.post("/auth/login", async (req, res) => {
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

  if (password !== process.env.ADMIN_PASSWORD) {
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

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy failed");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

router.get("/auth/me", (req, res) => {
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
