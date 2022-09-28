import mongoose, { Model, Schema } from "mongoose";
import { ITag } from "./interfaces";

const tagsSchema : Schema<ITag> = new mongoose.Schema({
  tagId: "Number",
  name: "String"
});

export const Tags : Model<ITag> = mongoose.model('tags', tagsSchema);
