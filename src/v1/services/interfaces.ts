import { ITag } from "../models";

export interface ResponseJson {
	message: string;
	tags?: TagData[];
	question?: ProblemData;
	questions?: ProblemData[];
	paging?: PagingData;
}

export interface TagData {
	name: string;
	tag_slug: string;
}

export interface ProblemData {
	title: string;
	title_slug: string;
	tags: Array<string>;
	id: number;
	frontend_id: number;
	difficulty: number;
	is_premium: boolean;
}

export interface PagingData {
	total: number;
	page: number;
	pages: number;
}

export interface ExpressQuery {
	limit: string;
	page: string;
	difficulty: string;
	premium: string;
	q: string;
	sort: string;
	tags: string;
}

export interface Params {
	problemId: string;
}

export interface MongooseQuery {
	difficulty?: Difficulty;
	isPremium?: boolean;
	title?: Search;
	problemID?: ProblemId;
}

export interface Difficulty {
	$in: number[];
}

export interface Search {
	$regex: string;
	$options: string;
}

export interface ProblemId {
	$in: number[];
}
