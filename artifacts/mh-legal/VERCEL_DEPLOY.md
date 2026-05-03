# Deploying the MH Legal frontend to Vercel

The backend (Express API + PostgreSQL + email) **stays on Replit**.
Only the React frontend ships to Vercel as a static site.

## One-time setup

1. **Publish the backend on Replit first.** Click Publish in the Replit
   workspace. Note the resulting URL, e.g.
   `https://mh-legal-services.replit.app`.

2. **Import the repo into Vercel.**
   - Go to https://vercel.com/new
   - Import `mhlegal/mh-legal-services`
   - Set the **Root Directory** to `artifacts/mh-legal`
   - Framework preset: **Other** (the included `vercel.json` handles
     build + SPA rewrites)

3. **Add the environment variable** in Vercel project settings →
   Environment Variables:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://mh-legal-services.replit.app` (your published Replit URL) |

   Apply to **Production**, **Preview**, and **Development**.

4. **Deploy.** Vercel installs pnpm workspaces and runs the build
   defined in `vercel.json`.

## How it works

- When `VITE_API_URL` is set, `apiFetch` calls
  `${VITE_API_URL}/api/...` instead of a same-origin `/api/...`.
- The Replit backend has `cors({ origin: true, credentials: true })`
  which reflects the Vercel origin and allows session cookies.
- Session cookies use `sameSite: "none"` and `secure: true` in
  production, so cross-origin login works.

## Updating the site later

- **Frontend changes** → push to GitHub `main`. Vercel auto-redeploys.
- **Backend changes** → publish again on Replit (Vercel doesn't need
  to rebuild as long as the API contract is unchanged).

## Custom domain

Add your domain in Vercel project settings → Domains. Vercel will
issue HTTPS automatically.
