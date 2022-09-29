import { ITag, Tags } from '../models';
import { logger } from '../../logger';
import { Request } from 'express';
import { HTTPError } from '../../http-error';
import { Query, ResponseJson, TagData, PagingData } from './interfaces';

export class TagsService {
  public static async getAllTags(req: Request<{}, {}, {}, Query>) : Promise<ResponseJson> {
    let data : ITag[];
    let total : number;
    const limit : number = parseInt(req.query.limit);
    const offset : number = parseInt(req.query.offset);

    try {
      data = await Tags.find()
        .limit(limit)
        .skip(offset);
      total = data.length;
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problems from database: " + e);
      throw new HTTPError("Error retrieving problems " + e, 500);
    }

    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.ceil(total % offset) || 1;

    const parsedData : TagData[] = data.map(tag  => { 
      return {
        id: tag.tagId,
        name: tag.name,
        name_slug: tag.nameSlug,
        number_of_problems: tag.numberOfProblems
      };
    });

    const paging : PagingData = {
      total,
      page: currentPage,
      pages: totalPages
    };

    const responseJson : ResponseJson = {
      message: "Successfully retrieved all leetcode tags",
      tags: parsedData,
      paging
    }

    return responseJson;
  }
}
