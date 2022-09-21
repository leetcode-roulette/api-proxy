import { Document } from "mongoose"

export interface IProblem extends Document {
  problemId: Number,
  title: string,
  titleSlug: string,
  isPremium: boolean,
  difficulty: number,
  frontEndId: number
};