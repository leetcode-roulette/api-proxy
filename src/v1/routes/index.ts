import express, { Router } from "express";
import healthcheckRouter from "./healthcheck";
import problemsRouter from "./problems";

const router : Router = express.Router();

router.use("/healthcheck", healthcheckRouter);
router.use("/problems", problemsRouter);

export default router;
