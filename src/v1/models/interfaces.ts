import { Document } from "mongoose";

export interface IProblem extends Document {
	problemId: number;
	title: string;
	titleSlug: string;
	isPremium: boolean;
	difficulty: number;
	frontEndId: number;
	numSubmitted: number;
	numAccepted: number;
}

export interface ITag extends Document {
	name: string;
	tagSlug: string;
}

export interface IProblemTag extends Document {
	problemID: number;
	tagSlug: string;
}
