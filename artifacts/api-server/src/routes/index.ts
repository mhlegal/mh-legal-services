import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import applicationsRouter from "./applications.js";
import leadsRouter from "./leads.js";
import analyticsRouter from "./analytics.js";
import agentReportsRouter from "./agent-reports.js";
import commissionsRouter from "./commissions.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(leadsRouter);
router.use(analyticsRouter);
router.use(agentReportsRouter);
router.use(commissionsRouter);

export default router;
