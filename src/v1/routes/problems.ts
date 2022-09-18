import express, { Router } from "express";
import { ProblemController } from "../controllers/problems";

const problemsRouter : Router = express.Router();
problemsRouter.route("/").get(ProblemController.getAllProblems);

export default problemsRouter;