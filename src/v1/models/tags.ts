import mongoose, { Model, Schema } from "mongoose";
import { ITag } from "./interfaces";

export const tagsSchema: Schema<ITag> = new mongoose.Schema({
	name: "string",
	tagSlug: "string",
});

export const Tags: Model<ITag> = mongoose.model("tags", tagsSchema);
