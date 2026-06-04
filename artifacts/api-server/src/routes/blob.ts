import { Router } from "express";
import multer from "multer";
import { generateUploadToken, objectStorage } from "../lib/objectStorage.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

// ─── Vercel Blob client-side upload token ─────────────────────────────────
// Used when BLOB_READ_WRITE_TOKEN is set (Vercel deployment).
router.post("/blob/upload", requireAuth, async (req, res) => {
  try {
    const jsonResponse = await generateUploadToken(req.body, req);
    res.json(jsonResponse);
  } catch (err: any) {
    if (err?.message === "BLOB_NOT_CONFIGURED") {
      res.status(400).json({ error: "BLOB_NOT_CONFIGURED" });
      return;
    }
    req.log.error({ err }, "Blob upload token generation failed");
    res.status(400).json({ error: err?.message ?? "Upload token generation failed" });
  }
});

// ─── Direct multipart upload (works without Vercel Blob) ─────────────────
// Both StudentPortal and CommissionsDashboard fall back to this endpoint
// when BLOB_READ_WRITE_TOKEN is not set (i.e. on Replit-only deployment).
router.post(
  "/upload/direct",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file received" });
      return;
    }
    try {
      const url = await objectStorage.uploadBuffer(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );
      res.json({ url });
    } catch (err: any) {
      req.log.error({ err }, "Direct upload failed");
      res.status(500).json({ error: err?.message ?? "Upload failed" });
    }
  }
);

export default router;
