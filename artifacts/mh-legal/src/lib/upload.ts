/**
 * uploadFile — uploads a file using the best available method.
 *
 * Priority:
 * 1. Vercel Blob client-side upload (when BLOB_READ_WRITE_TOKEN is configured on the server)
 * 2. Direct multipart POST to the API server (works on Replit, no external token needed)
 *
 * Returns the public URL of the uploaded file.
 */

import { BASE } from "@/lib/api";

async function directUpload(file: File, onProgress?: (msg: string) => void): Promise<string> {
  onProgress?.("Uploading file…");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE}/api/upload/direct`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Upload failed: ${res.status}`);
  }

  const data = await res.json() as { url: string };
  return data.url;
}

export async function uploadFile(
  file: File,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.("Uploading…");

  // Try Vercel Blob first
  try {
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: `${BASE}/api/blob/upload`,
    });
    return blob.url;
  } catch (err: any) {
    // BLOB_NOT_CONFIGURED means the server doesn't have a Vercel Blob token —
    // fall back to the direct upload endpoint which works on any host.
    const isBlobMissing =
      err?.message?.includes("BLOB_NOT_CONFIGURED") ||
      err?.message?.includes("missing token") ||
      err?.message?.includes("BLOB_READ_WRITE_TOKEN");

    if (!isBlobMissing) throw err;
  }

  return directUpload(file, onProgress);
}

/**
 * uploadMultipleFiles — upload multiple files using the best available method.
 * Uses Vercel Blob when configured, otherwise direct upload (one at a time for progress).
 */
export async function uploadMultipleFiles(
  files: File[],
  onProgress?: (msg: string) => void
): Promise<Array<{ file: File; url: string }>> {
  onProgress?.(files.length === 1 ? "Uploading file…" : `Uploading ${files.length} files…`);

  // Try Vercel Blob batch first
  try {
    const { upload } = await import("@vercel/blob/client");
    const results = await Promise.all(
      files.map((file) =>
        upload(file.name, file, {
          access: "public",
          handleUploadUrl: `${BASE}/api/blob/upload`,
        }).then((blob) => ({ file, url: blob.url }))
      )
    );
    return results;
  } catch (err: any) {
    const isBlobMissing =
      err?.message?.includes("BLOB_NOT_CONFIGURED") ||
      err?.message?.includes("missing token") ||
      err?.message?.includes("BLOB_READ_WRITE_TOKEN");

    if (!isBlobMissing) throw err;
  }

  // Direct upload fallback — upload sequentially for clarity
  const results: Array<{ file: File; url: string }> = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(files.length === 1 ? "Uploading file…" : `Uploading file ${i + 1} of ${files.length}…`);
    const url = await directUpload(file);
    results.push({ file, url });
  }
  return results;
}
