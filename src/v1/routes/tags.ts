import express, { Router } from "express";
import { TagsController } from "../controllers";

const tagsRouter : Router = express.Router();
tagsRouter.route("/").get(TagsController.getAllTags);

export default tagsRouter;