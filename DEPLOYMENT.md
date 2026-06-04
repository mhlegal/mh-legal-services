# MH Legal Services — Vercel Deployment Guide

Everything (frontend + API) deploys to **one** Vercel project from the same GitHub repo.

## Architecture

```
Vercel project: mh-legal-services
├── Frontend  — React SPA at /              (static, built by Vite)
└── API       — Express.js at /api/*        (serverless function, Node 22)
```

The session cookie is same-origin (frontend and API share the same domain), so login works
without any special cross-origin cookie configuration.

---

## One-Time Vercel Setup

### 1. Import the repo

- Go to https://vercel.com/new
- Import `mhlegal/mh-legal-services`
- **Root Directory**: leave as `.` (the project root — `vercel.json` is at the root)
- **Framework Preset**: Other
- Click **Deploy** (the first deploy will fail until you add env vars — that is expected)

### 2. Add environment variables

Go to **Project Settings → Environment Variables** and add ALL of the following.
Apply each to **Production**, **Preview**, and **Development**.

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://...` | Your PostgreSQL connection string |
| `SESSION_SECRET` | (a long random string) | Use `openssl rand -hex 32` to generate one |
| `ADMIN_PASSWORD` | (your admin password) | The password managers use to log in |
| `SMTP_USER` | `your@gmail.com` | Gmail address for sending emails |
| `SMTP_PASS` | (Gmail App Password) | **NOT** your Gmail password — generate one at myaccount.google.com → Security → App passwords |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | `your-gcs-bucket-name` | Google Cloud Storage bucket name |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | (service account JSON) | See step 3 below |

> **Note**: Do NOT set `VITE_API_URL`. Leave it empty. Since the frontend and API are on
> the same Vercel domain, the frontend automatically calls `/api/...` on the same host.

### 3. Set up Google Cloud credentials

The backend needs a GCS service account to store uploaded files.

1. Go to Google Cloud Console → IAM → Service Accounts
2. Create or use an existing service account with **Storage Object Admin** role
3. Create a JSON key and download it
4. In Vercel env vars, add `GOOGLE_APPLICATION_CREDENTIALS_JSON` with the full JSON content
5. Update `artifacts/api-server/src/lib/objectStorage.ts` to read from this env var:

```typescript
// In objectStorage.ts, replace:
export const objectStorageClient = new Storage();

// With:
const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
export const objectStorageClient = new Storage(
  credentialsJson ? { credentials: JSON.parse(credentialsJson) } : {}
);
```

### 4. Configure GCS bucket CORS (required for file uploads from the browser)

Uploads now go directly from the browser to GCS (no file data passes through the server).
The GCS bucket must allow CORS PUT requests from your Vercel domain.

Save the following as `gcs-cors.json` and apply it using the Google Cloud CLI:

```json
[
  {
    "origin": ["https://mh-legal-services.vercel.app", "http://localhost:5173"],
    "method": ["PUT"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "x-goog-acl"]
  }
]
```

```bash
gcloud storage buckets update gs://YOUR_BUCKET_NAME --cors-file=gcs-cors.json
```

Replace `YOUR_BUCKET_NAME` with your bucket and add your production Vercel domain
if it differs from `mh-legal-services.vercel.app`.

### 5. Redeploy

After adding all environment variables, go to **Deployments → Redeploy** (or push a commit).

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | Secret for signing session cookies |
| `ADMIN_PASSWORD` | ✅ | Manager portal password |
| `SMTP_USER` | ✅ | Gmail address for notifications |
| `SMTP_PASS` | ✅ | Gmail App Password |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | ✅ | GCS bucket name |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | ✅ | GCS service account JSON |
| `COOKIE_SAME_SITE` | ❌ | Set to `none` only for cross-origin setups |
| `ALLOWED_ORIGINS` | ❌ | Comma-separated origins for CORS (leave empty for same-origin Vercel) |

---

## Node.js & pnpm Versions

- Node.js: **22.x** (pinned in `vercel.json`)
- pnpm: **>=9** (auto-detected from `pnpm-lock.yaml` lockfileVersion 9.0)

---

## How file uploads work on Vercel

Vercel serverless functions have a 4.5MB request body limit. All file uploads in this
app bypass this limit using **presigned Google Cloud Storage URLs**:

1. The browser asks the API for a signed upload URL (`POST /api/.../upload-url`)
2. The browser uploads the file **directly to GCS** (no file data touches the server)
3. The browser tells the server the GCS path (`objectPath`) for processing/storage

This means file uploads of any size work correctly on Vercel.

---

## AI Commission Processing Timeout

Commission document processing uses OpenAI vision/text extraction which can take 30-90s
for large batches. The API function is configured with `maxDuration: 60` (requires Vercel
Pro or higher). On the free Hobby plan (10s limit), large commission uploads may timeout.
Upgrade to Pro or process files in smaller batches (1-2 files at a time).

---

## Updating the app

- Push to `main` → Vercel auto-deploys
- Database schema changes → run `pnpm --filter @workspace/db run push` against your production DB

