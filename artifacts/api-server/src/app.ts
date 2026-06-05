import express from "express";
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
const sameSite = (process.env.COOKIE_SAME_SITE as "lax" | "none" | "strict" | undefined) ?? "none";

app.use(
  session({
    store: new PgSession({ pool, tableName: "session", createTableIfMissing: false }),
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
// Files have random hex names so they are unguessable; safe to serve publicly.
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? join(process.cwd(), "data", "uploads");
app.use("/api/uploads", express.static(UPLOADS_DIR));

// Run migrations on every cold start — idempotent, safe to repeat
runMigrations().catch((err) => logger.error({ err }, "Migration runner failed"));

export default app;
