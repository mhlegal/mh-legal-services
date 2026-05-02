import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const MASTER_ADMIN = "ngobesesimangaliso47@gmail.com";
const BOSS_ARCHIVE = "mhlopheholdings@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail(to: string | string[], subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"MH Legal Services" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });
    logger.info({ to, subject }, "Email sent successfully");
  } catch (err) {
    logger.error({ err, to, subject }, "Failed to send email");
  }
}

export async function sendDualNotification(subject: string, html: string) {
  await sendMail([MASTER_ADMIN, BOSS_ARCHIVE], subject, html);
}

export async function sendSecurityAlert(loginEmail: string, ipAddress: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="border-bottom:2px solid #C9A961;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#C9A961;margin:0;font-size:20px;">SECURITY ALERT — MH Legal Services</h1>
      </div>
      <p style="color:#ccc;">A manager has logged into the admin portal.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px;color:#888;width:140px;">Email</td><td style="padding:8px;color:#fff;font-weight:bold;">${loginEmail}</td></tr>
        <tr><td style="padding:8px;color:#888;">Time</td><td style="padding:8px;color:#fff;">${new Date().toISOString()}</td></tr>
        <tr><td style="padding:8px;color:#888;">IP Address</td><td style="padding:8px;color:#fff;">${ipAddress}</td></tr>
      </table>
      <p style="color:#888;font-size:13px;margin-top:24px;">If this was not authorised, review access immediately.</p>
    </div>
  `;
  await sendMail(MASTER_ADMIN, "Security Alert: Manager Login Detected", html);
}

export async function sendApplicationNotification(application: {
  fullNames: string;
  saIdNumber: string;
  email: string;
  province: string;
  stipendStatus: boolean;
  willingToRelocate: boolean;
  trainingLetterPath?: string;
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="border-bottom:2px solid #C9A961;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#C9A961;margin:0;font-size:20px;">New Student Application — MH Legal Services</h1>
      </div>
      <p style="color:#ccc;">A new In-Service Training application has been submitted.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;width:160px;">Full Names</td><td style="padding:10px;color:#fff;font-weight:bold;">${application.fullNames}</td></tr>
        <tr><td style="padding:10px;color:#888;">SA ID Number</td><td style="padding:10px;color:#fff;">${application.saIdNumber}</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;">Email</td><td style="padding:10px;color:#fff;">${application.email}</td></tr>
        <tr><td style="padding:10px;color:#888;">Province</td><td style="padding:10px;color:#fff;">${application.province || "Not specified"}</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;">Stipend Status</td><td style="padding:10px;color:#C9A961;font-weight:bold;">${application.stipendStatus ? "YES — Stipend Requested" : "NO — No Stipend"}</td></tr>
        <tr><td style="padding:10px;color:#888;">Willing to Relocate</td><td style="padding:10px;color:#C9A961;font-weight:bold;">${application.willingToRelocate ? "YES — Open to Relocation" : "NO — Not Willing to Relocate"}</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;">Training Letter</td><td style="padding:10px;color:#fff;">${application.trainingLetterPath ? "Uploaded ✓" : "Not provided"}</td></tr>
        <tr><td style="padding:10px;color:#888;">Submitted At</td><td style="padding:10px;color:#fff;">${new Date().toLocaleString("en-ZA")}</td></tr>
      </table>
      <p style="color:#888;font-size:13px;margin-top:24px;">Log in to the Admin Dashboard to review this application.</p>
    </div>
  `;
  await sendDualNotification(`New Student Application: ${application.fullNames}`, html);
}

export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="border-bottom:2px solid #C9A961;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#C9A961;margin:0;font-size:20px;">New Client Lead — MH Legal Services</h1>
      </div>
      <p style="color:#ccc;">A new client enquiry has been received.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;width:140px;">Name</td><td style="padding:10px;color:#fff;font-weight:bold;">${lead.name}</td></tr>
        <tr><td style="padding:10px;color:#888;">Email</td><td style="padding:10px;color:#fff;">${lead.email}</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;">Phone</td><td style="padding:10px;color:#fff;">${lead.phone}</td></tr>
        <tr><td style="padding:10px;color:#888;">Service</td><td style="padding:10px;color:#C9A961;font-weight:bold;">${lead.service}</td></tr>
        ${lead.message ? `<tr style="background:#1a1a1a;"><td style="padding:10px;color:#888;">Message</td><td style="padding:10px;color:#fff;">${lead.message}</td></tr>` : ""}
        <tr><td style="padding:10px;color:#888;">Received At</td><td style="padding:10px;color:#fff;">${new Date().toLocaleString("en-ZA")}</td></tr>
      </table>
    </div>
  `;
  await sendDualNotification(`New Legal Lead: ${lead.service} — ${lead.name}`, html);
}
