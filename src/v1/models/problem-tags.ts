import mongoose, { Model, Schema } from "mongoose";
import { IProblemTag } from "./";

const problemTagsSchema : Schema<IProblemTag> = new mongoose.Schema({
  tagId: "number",
  tagSlug: "string",
  problemId: "number",
});

export const ProblemTags : Model<IProblemTag> = mongoose.model('problem-tags', problemTagsSchema);
