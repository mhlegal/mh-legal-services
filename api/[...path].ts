// DIAGNOSTIC: bare-minimum handler - no imports from app.ts
  // If this returns 200 JSON, the issue is in app.ts imports.
  // If this also fails, the issue is the function config itself.
  export default function handler(req: any, res: any) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "diagnostic_ok",
      url: req.url,
      dbSet: !!process.env.DATABASE_URL,
      secretSet: !!process.env.SESSION_SECRET,
    }));
  }
  