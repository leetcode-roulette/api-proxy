import { IProblem, Problems } from '../models/problems';
import { logger } from '../../logger';
import { Request } from 'express';
import { HTTPError } from '../../http-error';

export interface ResponseJson {
  message: string;
  question?: ProblemData;
  questions?: ProblemData[];
  paging?: PagingData;
}

export interface ProblemData {
  title: string;
  title_slug: string;
  id: Number;
  difficulty: Number;
  is_premium: boolean;
};

interface PagingData {
  total: number;
  page: number;
  pages: number;
};

export interface Query {
  limit: string;
  offset: string;
};

export interface Params {
  problemId: string
};

export class ProblemService {
  public static async getAllProblems(req : Request<{}, {}, {}, Query>) : Promise<ResponseJson> {
    let data : IProblem[];
    let total : number;
    const limit : number = parseInt(req.query.limit);
    const offset : number = parseInt(req.query.offset);
    
    try {
      data = await Problems.find({})
        .limit(limit)
        .skip(offset);
      total = await Problems.count();
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problems from database: " + e);
      throw new HTTPError("Error retrieving problems " + e, 500);
    }

    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.ceil(total % offset) || 1;

    const parsedData : ProblemData[] = data.map(problem  => { 
      return {
        title: problem.title,
        title_slug: problem.titleSlug,
        id: problem.problemId,
        difficulty: problem.difficulty,
        is_premium: problem.isPremium
      };
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
  }

  public static async getProblemById(req : Request<Params, {}, {}, Query>) : Promise<ResponseJson> {
    let data : IProblem | null;

    try {
      data = await Problems.findOne({ problemId: req.params.problemId});
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problem from database by id: " + e)
      throw new HTTPError("Error retrieving problem by id " + e, 500);
    }

    if (data === null) {
      throw new HTTPError("No problem found with provided id", 404);
    }

    const parsedData : ProblemData = {
      title: data.title,
      title_slug: data.titleSlug,
      id: data.problemId,
      difficulty: data.difficulty,
      is_premium: data.isPremium,
    };

    const responseJson : ResponseJson = {
      message: "Successfully retrieved problem with provided ID",
      question: parsedData
    };

    return responseJson;
  }
}