// Vercel serverless function — wraps the Express app as a catch-all for /api/*
  // Diagnostic wrapper: converts any init-time crash into a JSON response instead of
  // Vercel's opaque FUNCTION_INVOCATION_FAILED error page.
  import type { IncomingMessage, ServerResponse } from "http";

  type Handler = (req: IncomingMessage, res: ServerResponse) => void;

  let _handler: Handler | undefined;
  let _initError: string | undefined;

  async function init(): Promise<Handler> {
    if (_handler) return _handler;
    if (_initError) throw new Error(_initError);
    try {
      const { default: app } = await import("../artifacts/api-server/src/app.js");
      _handler = app as unknown as Handler;
      return _handler;
    } catch (err: any) {
      _initError = err?.stack ?? err?.message ?? String(err);
      throw new Error(_initError);
    }
  }

  export default async function handler(req: IncomingMessage, res: ServerResponse) {
    try {
      const app = await init();
      await new Promise<void>((resolve) => {
        res.on("finish", resolve);
        res.on("close", resolve);
        app(req, res);
      });
    } catch (err: any) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: "Server initialization failed",
          message: _initError ?? err?.message,
        }));
      }
    }
  }
  