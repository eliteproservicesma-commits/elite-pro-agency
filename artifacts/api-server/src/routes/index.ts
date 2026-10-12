import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsletterOtpRouter from "./newsletter-otp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsletterOtpRouter);

export default router;
