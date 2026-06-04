import { createReadStream } from "fs";
import { mkdir, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { logger } from "./logger.js";

// ─── File storage directory (persistent on Replit) ────────────────────────
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? join(process.cwd(), "data", "uploads");

async function ensureUploadsDir() {
  await mkdir(UPLOADS_DIR, { recursive: true });
}

// ─── Vercel Blob (when BLOB_READ_WRITE_TOKEN is set) ──────────────────────
let _vercelBlob: typeof import("@vercel/blob") | null = null;

async function getVercelBlob() {
  if (_vercelBlob) return _vercelBlob;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    _vercelBlob = await import("@vercel/blob");
    return _vercelBlob;
  } catch {
    return null;
  }
}

// ─── handleUpload (for the /blob/upload client-side token endpoint) ────────
// When Vercel Blob is available, use their handleUpload.
// When not, generate a token that our /upload/direct endpoint accepts.
export async function generateUploadToken(body: any, req: any) {
  const blob = await getVercelBlob();
  if (blob) {
    const { handleUpload } = await import("@vercel/blob/client");
    return handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "application/pdf",
          "application/octet-stream",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ],
        maximumSizeInBytes: 20 * 1024 * 1024,
      }),
      onUploadCompleted: async ({ blob: b }) => {
        logger.info({ url: b.url }, "Blob upload completed");
      },
    });
  }

  // Fallback: return a no-op token so the client gets a clear error
  // that redirects it to the direct upload path.
  throw new Error("BLOB_NOT_CONFIGURED");
}

// ─── objectStorage ──────────────────────────────────────────────────────────

export const objectStorage = {
  // Upload a buffer — uses Vercel Blob if available, otherwise local filesystem.
  async uploadBuffer(fileName: string, contentType: string, buffer: Buffer): Promise<string> {
    const blob = await getVercelBlob();
    if (blob) {
      const result = await blob.put(fileName, buffer, { access: "public", contentType });
      return result.url;
    }

    // Local storage fallback
    await ensureUploadsDir();
    const ext = fileName.split(".").pop() ?? "bin";
    const safeName = `${randomBytes(12).toString("hex")}.${ext}`;
    const filePath = join(UPLOADS_DIR, safeName);
    await writeFile(filePath, buffer);
    const host = process.env.REPLIT_DOMAINS?.split(",")[0] ?? "localhost:8080";
    return `https://${host}/api/uploads/${safeName}`;
  },

  // Download from a URL — works for Vercel Blob URLs, local URLs, or any https URL.
  async downloadObject(blobUrl: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    if (blobUrl.startsWith("local://")) {
      // Internal local file reference
      const safeName = blobUrl.replace("local://", "");
      const filePath = join(UPLOADS_DIR, safeName);
      return { stream: createReadStream(filePath), contentType: "application/octet-stream" };
    }

    // HTTP(S) URL — works for both Vercel Blob and local server URLs
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${blobUrl}`);
    }
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    return { stream: response.body as unknown as NodeJS.ReadableStream, contentType };
  },

  // Delete a file from local storage (Vercel Blob files are managed by Vercel).
  async deleteObject(blobUrl: string): Promise<void> {
    if (!blobUrl.startsWith("local://")) return;
    const safeName = blobUrl.replace("local://", "");
    try {
      await unlink(join(UPLOADS_DIR, safeName));
    } catch {
      // ignore if file doesn't exist
    }
  },
};
