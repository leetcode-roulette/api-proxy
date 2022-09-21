import express, { Router } from "express";
import { notFound } from "../controllers";
import healthcheckRouter from "./healthcheck";
import problemsRouter from "./problems";

const router : Router = express.Router();

router.use("/healthcheck", healthcheckRouter);
router.use("/problems", problemsRouter);
router.use("*", notFound);

export default router;
