// Vercel serverless function — wraps the Express app as a catch-all for /api/*
// All requests to /api/* on Vercel are forwarded here and handled by Express.
import app from "../artifacts/api-server/src/app.js";
export default app;
