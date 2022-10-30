import { IProblemTag, ITag, ProblemTags, Tags } from "../models";
import { logger } from "../../logger";
import { Request } from "express";
import { HTTPError } from "../../http-error";
import { ExpressQuery, ResponseJson, TagData, PagingData } from "./";

export class TagsService {
	public static async getAllTags(req: Request<{}, {}, {}, ExpressQuery>): Promise<ResponseJson> {
		try {
			const limit: number = parseInt(req.query.limit);
			const page: number = parseInt(req.query.page) || 1;

			const data: ITag[] = await Tags.find()
				.limit(limit)
				.skip((page - 1) * limit);

			const problemTags: IProblemTag[] = await ProblemTags.find();
			const numberOfProblemsByTag: Object = {};

			problemTags.forEach(problemTag => {
				const tagSlug = problemTag.tagSlug;

				if (!(tagSlug in numberOfProblemsByTag)) {
					numberOfProblemsByTag[tagSlug] = 0;
				}

				numberOfProblemsByTag[tagSlug]++;
			});

			const total: number = await Tags.countDocuments();
			const totalPages: number = Math.ceil(total / limit) || 1;

			const parsedData: TagData[] = data.map((tag) => {
				return this.getTagData(tag, numberOfProblemsByTag);
			});

			const paging: PagingData = {
				total,
				page: page,
				pages: totalPages,
			};

			const responseJson: ResponseJson = {
				message: "Successfully retrieved all leetcode tags",
				tags: parsedData.sort((a, b) => b.number_of_problems - a.number_of_problems),
				paging,
			};

			return responseJson;
		} catch (e: any) {
			logger.error("Exception caught retrieving leetcode problems from database: " + e);
			throw new HTTPError("Error retrieving tags " + e, 500);
		}
	}

	private static getTagData(tag: ITag, numberOfProblemsByTag: Object): TagData {
		return {
			name: tag.name,
			tag_slug: tag.tagSlug,
			number_of_problems: numberOfProblemsByTag[tag.tagSlug]
		};
	}
}
