import { Storage } from "@google-cloud/storage";
import { logger } from "./logger.js";

export const objectStorageClient = new Storage();

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
const PRIVATE_DIR = process.env.PRIVATE_OBJECT_DIR ?? "uploads";

export class ObjectStorageService {
  private bucket = objectStorageClient.bucket(BUCKET_ID);

  async getObjectEntityUploadURL(fileName: string, contentType: string): Promise<{ uploadURL: string; objectPath: string }> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const gcsPath = `${PRIVATE_DIR}/${id}-${fileName}`;
    const file = this.bucket.file(gcsPath);

    const [uploadURL] = await file.generateSignedPostPolicyV4({
      expires: Date.now() + 15 * 60 * 1000,
      conditions: [["content-length-range", 0, 20 * 1024 * 1024]],
    });

    const objectPath = `/objects/${gcsPath}`;
    return { uploadURL: uploadURL.url, objectPath };
  }

  async getPresignedPutURL(fileName: string, contentType: string): Promise<{ uploadURL: string; objectPath: string }> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const gcsPath = `${PRIVATE_DIR}/${id}-${encodeURIComponent(fileName)}`;
    const file = this.bucket.file(gcsPath);

    const [uploadURL] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    const objectPath = `/objects/${gcsPath}`;
    return { uploadURL, objectPath };
  }

  async downloadObject(objectPath: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    const gcsPath = objectPath.replace(/^\/objects\//, "");
    const file = this.bucket.file(gcsPath);
    const [metadata] = await file.getMetadata();
    const stream = file.createReadStream();
    return { stream, contentType: (metadata.contentType as string) ?? "application/octet-stream" };
  }
}

export const objectStorage = new ObjectStorageService();
