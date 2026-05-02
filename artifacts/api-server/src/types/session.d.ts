import "express-session";

declare module "express-session" {
  interface SessionData {
    adminEmail: string;
    isMasterAdmin: boolean;
  }
}
