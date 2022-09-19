import { IProblem, Problems } from '../models/problems';
import { logger } from '../../logger';
import { Request } from 'express';

export interface ResponseJson {
  message: string;
  questions: ProblemData[];
  paging: PagingData;
}

interface ProblemData {
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
}

export interface Query {
  limit: string;
  offset: string;
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
      throw new Error("Error retrieving problems " + e);
    }

    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.ceil(total % offset) || 0;

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
      message: "",
      questions: parsedData,
      paging
    }

    return responseJson;
  }
}