import express, { Router, Request, Response } from "express";
import healthcheck from "../controllers/healthcheck";

const router : Router = express.Router();

router.route("/healthcheck").get(healthcheck);

export default router;
