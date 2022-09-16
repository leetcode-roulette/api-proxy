import express, { Router } from "express";
import { healthcheck } from "../controllers";

const healthcheckRouter : Router = express.Router();
healthcheckRouter.route("/").get(healthcheck);

export default healthcheckRouter;