// When deployed separately (frontend on Vercel, backend on Replit) (e.g. frontend on Vercel, backend on Replit),
// set VITE_API_URL to the full backend origin, e.g. "https://your-app.replit.app".
// When unset (default — same-origin Replit deploy), API calls use the local /api path.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const BASE = API_ORIGIN || BASE_PATH;

export { BASE };

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    ...options,
    // headers must come after ...options so we always merge correctly
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  return res;
}

export async function apiJson<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
