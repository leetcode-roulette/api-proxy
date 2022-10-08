import { IProblem, Problems } from '../models';
import { logger } from '../../logger';
import { Request } from 'express';
import { HTTPError } from '../../http-error';
import { Params, ResponseJson, ProblemData, PagingData, Query, ExpressQuery } from './';

export class ProblemService {
  public static async getAllProblems(req : Request<{}, {}, {}, ExpressQuery>) : Promise<ResponseJson> {
    try {
      const query = new Query(req.query);
      const limit : number = parseInt(req.query.limit);
      const offset : number = parseInt(req.query.offset);

      const data : IProblem[] = await Problems.find(await query.getQuery())
        .sort(query.getSort())
        .limit(limit)
        .skip(offset);

      const total : number = data.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const currentPage = Math.ceil(total % offset) || 1;

      const parsedData : ProblemData[] = data.map(problem  => { 
        return this.getProblemData(problem);
      });

      const paging : PagingData = {
        total,
        page: currentPage,
        pages: totalPages
      };

      const responseJson : ResponseJson = {
        message: "Successfully retrieved all leetcode problems",
        questions: parsedData,
        paging
      }
  
      return responseJson;
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problems from database: " + e);
      throw new HTTPError("Error retrieving problems " + e, 500);
    }
  }

  public static async getProblemById(req : Request<Params, {}, {}, ExpressQuery>) : Promise<ResponseJson> {
    try {
      const problem : IProblem | null = await Problems.findOne({ problemId: req.params.problemId});

      if (problem === null) {
        throw new HTTPError("No problem found with provided id", 404);
      }

      const parsedData : ProblemData = this.getProblemData(problem);
      const responseJson : ResponseJson = {
        message: "Successfully retrieved problem with provided ID",
        question: parsedData
      };

      return responseJson;
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problem from database by id: " + e)
      throw new HTTPError("Error retrieving problem by id " + e, e.statusCode || 500);
    }
  }

  private static getProblemData(problem: IProblem) : ProblemData {
    return {
      title: problem.title,
      title_slug: problem.titleSlug,
      id: problem.problemId,
      difficulty: problem.difficulty,
      is_premium: problem.isPremium,
      num_submitted: problem.numSubmitted,
      num_accepted: problem.numAccepted
    };
  }
}
