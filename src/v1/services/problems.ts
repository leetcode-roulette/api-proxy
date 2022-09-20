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
  difficulty: string;
  premium: string;
};

export interface Params {
  problemId: string
};

interface MongooseQuery {
  difficulty?: Difficulty;
  isPremium?: boolean;
}

interface Difficulty {
  "$in": number[];
}

export class ProblemService {
  public static async getAllProblems(req : Request<{}, {}, {}, Query>) : Promise<ResponseJson> {
    let data : IProblem[];
    let total : number;
    const limit : number = parseInt(req.query.limit);
    const offset : number = parseInt(req.query.offset);
    
    try {
      data = await Problems.find(this.getMongooseQuery(req.query))
        .limit(limit)
        .skip(offset);
      total = data.length;
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

  private static getMongooseQuery(q : Query) : MongooseQuery {
    const query : MongooseQuery = {};

    if (q.difficulty) {
      query.difficulty = {"$in": this.getDifficultyArray(q.difficulty.split(','))};
    }

    if (q.premium && q.premium.toLowerCase() === "false") {
      query.isPremium = false;
    }

    return query;
  }

  private static getDifficultyArray(difficulties: string[]) : Array<number> {
    const output : number[] = [];

    for (let i = 0; i < difficulties.length; i++) {
      if (this.isAValidDifficulty(difficulties[i])) output.push(this.getDifficulty(difficulties[i]));
    }

    return output;
  }

  private static isAValidDifficulty(difficulty: string) : boolean {
    const d = difficulty.toLowerCase();
    const valid = ["1", "2", "3", "easy", "medium", "hard"];

    for (let i = 0; i < valid.length; i++) {
      if (d === valid[i]) return true;
    }

    return false;
  }

  private static getDifficulty(difficulty: string) : number {
    switch(difficulty.toLowerCase()) {
      case("easy"):
        return 1;
      case("medium"):
        return 2;
      case("hard"):
        return 3;
    }

    return parseInt(difficulty);
  }
}