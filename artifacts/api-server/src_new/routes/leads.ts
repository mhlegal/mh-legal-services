import { Router } from "express";
import { sendLeadNotification } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.post("/leads", async (req, res) => {
  const { name, email, phone, service, message } = req.body as {
    name: string;
    email: string;
    phone: string;
    service: string;
    message?: string;
  };

  if (!name || !email || !phone || !service) {
    res.status(400).json({ error: "Name, email, phone and service are required" });
    return;
  }

  sendLeadNotification({ name, email, phone, service, message }).catch((err) =>
    logger.error({ err }, "Failed to send lead notification")
  );

  res.status(201).json({ success: true });
});

export default router;
