import express, { Router } from "express";
import { notFound } from "../controllers";
import healthcheckRouter from "./healthcheck";
import problemsRouter from "./problems";
import tagsRouter from "./tags";

const router : Router = express.Router();

router.use("/healthcheck", healthcheckRouter);
router.use("/problems", problemsRouter);
router.use("/tags", tagsRouter);
router.use("*", notFound);

export default router;
