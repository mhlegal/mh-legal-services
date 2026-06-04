import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./lib/db.js";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { runMigrations } from "./lib/migrate.js";

const app: Express = express();
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

// Run migrations on every cold start — idempotent, safe to repeat
runMigrations().catch((err) => logger.error({ err }, "Migration runner failed"));

export default app;
