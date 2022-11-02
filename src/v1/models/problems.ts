import mongoose, { Model, Schema } from "mongoose";
import { IProblem } from "./";
import { tagsSchema } from "./tags";

const problemsSchema : Schema<IProblem> = new mongoose.Schema({
  problemID: 'number',
  problemFrontendID: 'number',
  title: 'string',
  titleSlug: 'string',
  tags: [tagsSchema],
  isPremium: 'boolean',
  difficulty: 'number',
  content: 'string',
  stats: {
    accepted: 'number',
    submissions: 'number',
    acRate: 'string'
  },
  hints: ['string']
});

export const Problems : Model<IProblem> = mongoose.model('problemdatas', problemsSchema);
