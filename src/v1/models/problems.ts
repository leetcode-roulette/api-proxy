import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProblem extends Document {
  problemId: Number,
  title: string,
  titleSlug: string,
  isPremium: boolean,
  difficulty: number,
  frontEndId: number
};

const problemsSchema : Schema<IProblem> = new mongoose.Schema({
  problemId: 'number',
  title: 'string',
  titleSlug: 'string',
  isPremium: 'boolean',
  difficulty: 'number',
  frontEndId: 'number'
});

const Problems : Model<IProblem> = mongoose.model('problems', problemsSchema);

export {
  Problems
};