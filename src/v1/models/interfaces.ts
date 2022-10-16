import { Document } from "mongoose";

export interface IProblem extends Document {
	problemID: number;
	problemFrontendID: number;
	title: string;
	titleSlug: string;
	tags: Array<ITag>;
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
