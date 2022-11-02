import { Document } from "mongoose";

interface Stats {
	accepted: number;
	submissions: number;
	acRate: string;
}

export interface IProblem extends Document {
	problemID: number;
	problemFrontendID: number;
	title: string;
	titleSlug: string;
	tags: Array<ITag>;
	isPremium: boolean;
	difficulty: number;
	frontEndId: number;
	stats: Stats;
	hints: Array<string>;
	content: string;
}

export interface ITag extends Document {
	name: string;
	tagSlug: string;
}

export interface IProblemTag extends Document {
	problemID: number;
	tagSlug: string;
}
