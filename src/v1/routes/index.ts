import express, { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.v1.json";
import healthcheckRouter from "./healthcheck";
import problemsRouter from "./problems";

const router : Router = express.Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/healthcheck", healthcheckRouter);
router.use("/problems", problemsRouter);

export default router;
