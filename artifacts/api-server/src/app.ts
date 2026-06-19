import express, { type NextFunction, type Request, type Response } from "express";
  import cors from "cors";
  import { pinoHttp } from "pino-http";
  import session from "express-session";
  import connectPgSimple from "connect-pg-simple";
  import { join } from "path";
  import { pool } from "./lib/db.js";
  import router from "./routes/index.js";
  import { logger } from "./lib/logger.js";
  import { runMigrations } from "./lib/migrate.js";

  const app = express();
  const PgSession = connectPgSimple(session);

  // Trust reverse proxy so secure cookies work (Replit or Vercel)
  app.set("trust proxy", 1);

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    })
  );

  // CORS: when ALLOWED_ORIGINS is set (cross-origin setup), use a whitelist.
  // When unset (same-origin Vercel deploy), reflect the request origin permissively.
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : null;

  app.use(
    cors({
      origin: allowedOrigins ?? true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session cookie:
  // - sameSite "lax"  → same-origin Vercel deploy (frontend + API on same domain)
  // - sameSite "none" → cross-origin setup (set COOKIE_SAME_SITE=none in env)
  const sameSite = (process.env.COOKIE_SAME_SITE as "lax" | "none" | "strict" | undefined) ?? "lax";

  app.use(
    session({
      // createTableIfMissing:true lets connect-pg-simple self-heal on a fresh DB
      // before runMigrations() has completed on the very first cold start.
      store: new PgSession({ pool, tableName: "session", createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET ?? "mhlegal-secret-fallback",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
        sameSite,
      },
    })
  );

  app.use("/api", router);

  // Serve locally-uploaded files (fallback when BLOB_READ_WRITE_TOKEN is not set).
  const UPLOADS_DIR = process.env.UPLOADS_DIR ?? join(process.cwd(), "data", "uploads");
  app.use("/api/uploads", express.static(UPLOADS_DIR));

  // ── Global JSON error handler ──────────────────────────────────────────────
  // Must be defined AFTER all routes. Express 5 automatically catches async
  // errors thrown in route handlers and forwards them here.
  // Without this, Express falls back to its built-in HTML error page which
  // breaks JSON API clients.
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Unhandled server error");
    const status = (err as any).status ?? (err as any).statusCode ?? 500;
    res.status(status).json({ error: err.message ?? "Internal server error" });
  });

  // Run migrations on every cold start — idempotent, safe to repeat
  runMigrations().catch((err) => logger.error({ err }, "Migration runner failed"));

  export default app;
  