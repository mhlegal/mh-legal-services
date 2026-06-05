#!/bin/bash
set -e

pnpm install --frozen-lockfile
# DB migrations run automatically at API server startup (runMigrations in app.ts).
# We do NOT run drizzle-kit push here — it requires an interactive TTY and will
# prompt about data-loss when run in CI. The Express migration runner is the
# single source of truth for schema changes in this project.

if [ -n "$GITHUB_TOKEN" ]; then
  git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/mhlegal/mh-legal-services.git"
  git push --force origin main
fi
