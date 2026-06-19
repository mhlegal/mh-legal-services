import { query } from "./db.js";
  import { logger } from "./logger.js";

  /**
   * Runs all CREATE TABLE IF NOT EXISTS statements on startup.
   * Safe to call every time the server starts — fully idempotent.
   * The `session` table is also handled by connect-pg-simple (createTableIfMissing:true).
   */
  export async function runMigrations() {
    logger.info("Running database migrations…");

    const statements: [string, string][] = [

      // ── Session store (connect-pg-simple) ─────────────────────────────────
      ["session_table", `
        CREATE TABLE IF NOT EXISTS "session" (
          "sid"    VARCHAR   NOT NULL COLLATE "default",
          "sess"   JSON      NOT NULL,
          "expire" TIMESTAMP(6) NOT NULL,
          CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
        ) WITH (OIDS=FALSE)
      `],
      ["session_expire_idx", `
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
      `],

      // ── Student applications submitted via the public portal ──────────────
      ["student_applications", `
        CREATE TABLE IF NOT EXISTS student_applications (
          id                  SERIAL PRIMARY KEY,
          full_names          TEXT NOT NULL,
          sa_id_number        TEXT NOT NULL,
          physical_address    TEXT NOT NULL,
          email               TEXT NOT NULL,
          stipend_status      BOOLEAN NOT NULL DEFAULT FALSE,
          province            TEXT,
          willing_to_relocate BOOLEAN NOT NULL DEFAULT FALSE,
          training_letter_path TEXT,
          created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Manager login audit trail ──────────────────────────────────────────
      ["audit_log", `
        CREATE TABLE IF NOT EXISTS audit_log (
          id          SERIAL PRIMARY KEY,
          admin_email TEXT NOT NULL,
          action      TEXT NOT NULL,
          ip_address  TEXT,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Commission periods (fortnights) ───────────────────────────────────
      ["commission_periods", `
        CREATE TABLE IF NOT EXISTS commission_periods (
          id            SERIAL PRIMARY KEY,
          label         TEXT NOT NULL,
          period_start  TIMESTAMPTZ NOT NULL,
          period_end    TIMESTAMPTZ NOT NULL,
          status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'finalised')),
          payment_date  TIMESTAMPTZ,
          finalised_by  TEXT,
          finalised_at  TIMESTAMPTZ,
          notes         TEXT,
          created_by    TEXT NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Uploaded commission document records ──────────────────────────────
      ["commission_statements", `
        CREATE TABLE IF NOT EXISTS commission_statements (
          id              SERIAL PRIMARY KEY,
          uploaded_by     TEXT NOT NULL,
          file_name       TEXT NOT NULL,
          file_path       TEXT NOT NULL,
          fortnight_start TIMESTAMPTZ,
          fortnight_end   TIMESTAMPTZ,
          period_id       INTEGER REFERENCES commission_periods(id) ON DELETE CASCADE,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Individual commission entries extracted from documents ─────────────
      ["commission_entries", `
        CREATE TABLE IF NOT EXISTS commission_entries (
          id              SERIAL PRIMARY KEY,
          statement_id    INTEGER NOT NULL REFERENCES commission_statements(id) ON DELETE CASCADE,
          agent_name      TEXT NOT NULL,
          policy_number   TEXT NOT NULL DEFAULT '',
          client_name     TEXT NOT NULL DEFAULT '',
          amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
          sale_type       TEXT NOT NULL DEFAULT 'unknown' CHECK (sale_type IN ('reg26a', 'private_order', 'unknown')),
          fortnight_start TIMESTAMPTZ,
          fortnight_end   TIMESTAMPTZ,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Partial unique index: no duplicate policy numbers (empty string OK) ─
      ["commission_entries_policy_idx", `
        CREATE UNIQUE INDEX IF NOT EXISTS commission_entries_policy_unique
        ON commission_entries (policy_number)
        WHERE policy_number <> ''
      `],

      // ── Website page-view analytics ───────────────────────────────────────
      ["page_visits", `
        CREATE TABLE IF NOT EXISTS page_visits (
          id         SERIAL PRIMARY KEY,
          path       TEXT NOT NULL,
          visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Manager agent-count reports by province ───────────────────────────
      ["agent_reports", `
        CREATE TABLE IF NOT EXISTS agent_reports (
          id           SERIAL PRIMARY KEY,
          submitted_by TEXT NOT NULL,
          agent_count  INTEGER NOT NULL,
          province     TEXT NOT NULL,
          period       TEXT NOT NULL,
          notes        TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Shared admin password override (set via forgot-password flow) ──────
      ["app_settings", `
        CREATE TABLE IF NOT EXISTS app_settings (
          key        TEXT PRIMARY KEY,
          value      TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── One-time password reset tokens (15-minute expiry) ─────────────────
      ["password_reset_tokens", `
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          token      TEXT PRIMARY KEY,
          email      TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used       BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],

      // ── Client leads from the contact/services forms ───────────────────────
      ["leads", `
        CREATE TABLE IF NOT EXISTS leads (
          id         SERIAL PRIMARY KEY,
          name       TEXT NOT NULL,
          email      TEXT NOT NULL,
          phone      TEXT NOT NULL,
          service    TEXT NOT NULL,
          message    TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `],
    ];

    let ok = 0;
    let failed = 0;

    for (const [name, sql] of statements) {
      try {
        // Pass no params array for DDL statements — some pg versions reject []
        await query(sql.trim());
        ok++;
      } catch (err) {
        logger.error({ err, table: name }, `Migration failed for: ${name}`);
        failed++;
      }
    }

    if (failed > 0) {
      logger.warn({ ok, failed }, "Migrations completed with errors — check logs above");
    } else {
      logger.info({ tables: ok }, "All migrations completed successfully");
    }
  }
  