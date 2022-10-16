import mongoose, { Model, Schema } from "mongoose";
import { IProblemTag } from "./";

const problemTagsSchema: Schema<IProblemTag> = new mongoose.Schema({
	tagSlug: "string",
	problemID: "number",
});

export const ProblemTags: Model<IProblemTag> = mongoose.model("problemtags", problemTagsSchema);
