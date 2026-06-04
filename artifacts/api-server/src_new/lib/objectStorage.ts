import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { logger } from "./logger.js";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/octet-stream",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Generate a client-side upload token so the browser can upload directly to
// Vercel Blob CDN — bypasses the 4.5 MB serverless body limit entirely.
export async function generateUploadToken(body: HandleUploadBody, req: any) {
  return handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ALLOWED_TYPES,
      maximumSizeInBytes: 20 * 1024 * 1024,
    }),
    onUploadCompleted: async ({ blob }) => {
      logger.info({ url: blob.url }, "Blob upload completed");
    },
  });
}

// Keeps the same interface used by existing route handlers so nothing else breaks.
export const objectStorage = {
  // Server-side buffer upload — for small files only.
  async uploadBuffer(fileName: string, contentType: string, buffer: Buffer): Promise<string> {
    const blob = await put(fileName, buffer, { access: "public", contentType });
    return blob.url;
  },

  // Download from a Vercel Blob URL and return a readable stream + content type.
  async downloadObject(blobUrl: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to download blob: ${response.status} ${blobUrl}`);
    }
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    return { stream: response.body as unknown as NodeJS.ReadableStream, contentType };
  },
};
