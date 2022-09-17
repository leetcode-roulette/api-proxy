import mongoose, { Schema } from "mongoose";

const problemsSchema : Schema = new mongoose.Schema({
  problemId: 'number',
  title: 'string',
  titleSlug: 'string',
  isPremium: 'boolean',
  difficulty: 'number',
  frontEndId: 'number'
});

const Problems = mongoose.model('problems', problemsSchema);

export {
  Problems
};