import { Router } from "express";
import { generateUploadToken } from "../lib/objectStorage.js";
import type { HandleUploadBody } from "@vercel/blob/client";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

// Client-side upload token endpoint.
// The browser calls this, gets a short-lived token, then uploads the file
// directly to Vercel Blob CDN — completely bypassing the 4.5 MB body limit.
// Also handles the post-upload completion callback from Vercel's CDN.
router.post("/blob/upload", requireAuth, async (req, res) => {
  try {
    const jsonResponse = await generateUploadToken(req.body as HandleUploadBody, req);
    res.json(jsonResponse);
  } catch (err: any) {
    req.log.error({ err }, "Blob upload token generation failed");
    res.status(400).json({ error: err?.message ?? "Upload token generation failed" });
  }
});

export default router;
