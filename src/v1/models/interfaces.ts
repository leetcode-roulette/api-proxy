import { Document } from "mongoose"

export interface IProblem extends Document {
  problemId: number;
  title: string;
  titleSlug: string;
  isPremium: boolean;
  difficulty: number;
  frontEndId: number;
  numSubmitted: number;
  numAccepted: number;
};

export interface ITag extends Document {
  tagId: number;
  name: string;
  nameSlug: string;
  numberOfProblems: number;
}

export interface IProblemTag extends Document {
  tagId: number;
  problemId: number;
}
