import { IProblem, Problems, ProblemTags, Tags } from '../models';
import { logger } from '../../logger';
import { Request } from 'express';
import { HTTPError } from '../../http-error';
import { Query, Params, MongooseQuery, ResponseJson, ProblemData, PagingData } from './';

export class ProblemService {
  public static async getAllProblems(req : Request<{}, {}, {}, Query>) : Promise<ResponseJson> {
    let data : IProblem[];
    let total : number;
    const limit : number = parseInt(req.query.limit);
    const offset : number = parseInt(req.query.offset);
    
    try {
      const query = await this.getMongooseQuery(req.query);
      data = await Problems.find(query)
        .sort(this.getSortString(req.query.sort))
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
        is_premium: problem.isPremium,
        num_submitted: problem.numSubmitted,
        num_accepted: problem.numAccepted
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
      num_submitted: data.numSubmitted,
      num_accepted: data.numAccepted
    };

    const responseJson : ResponseJson = {
      message: "Successfully retrieved problem with provided ID",
      question: parsedData
    };

    return responseJson;
  }

  private static async getMongooseQuery(q : Query) : Promise<MongooseQuery> {
    const query : MongooseQuery = {};

    if (q.q) {
      query.title = {"$regex": q.q.split(',').join('|'), "$options": "i"};
    }

    if (q.difficulty) {
      query.difficulty = {"$in": this.getDifficultyArray(q.difficulty.split(','))};
    }

    if (q.premium && q.premium.toLowerCase() === "false") {
      query.isPremium = false;
    }

    if (q.tags) {
      const problemIds = await this.getProblemIds(q.tags.split(","));
      query.problemId = {"$in": problemIds};
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

  private static getSortString(sortString : string | null) : string {
    const sortStrings : Set<string> = new Set([
      "difficulty",
      "title",
      "problemId"
    ]);

    if (!sortString || !sortStrings.has(sortString)) {
      sortString = "problemId";
    }

    return sortString;
  }

  private static async getProblemIds(tags : string[]) : Promise<number[]> {
    const processes : Promise<void>[] = [];
    const problemIds : number[] = [];

    tags.forEach(tag => {
      processes.push(this.appendProblemIdsByTagSlug(tag, problemIds));
    });

    await Promise.all(processes);
    return problemIds;
  }

  private static async appendProblemIdsByTagSlug(nameSlug: string, problemIds: number[]) : Promise<void> {
    try {
      const tagId = await this.getTagIdBySlug(nameSlug);
      const ids = await this.getProblemIdsByTagId(tagId);
      problemIds.push(...ids);
    } catch(e) {
      throw new Error("Exception caught getting problem Ids: " + e);
    }
  }

  private static async getTagIdBySlug(nameSlug : string) : Promise<number> {
    let tagId;

    try {
      const tag = await Tags.findOne({ nameSlug });
      tagId = tag?.tagId;
    } catch(e) {
      throw new Error("Exception caught getting tag by slug: " + e);
    }

    return tagId;
  }

  private static async getProblemIdsByTagId(tagId : number) : Promise<number[]> {
    const problemIds : number[] = [];

    try {
      const problemTags = await ProblemTags.find({ tagId });
      problemTags.forEach( problemTag => {
        problemIds.push(problemTag.problemId);
      });
    } catch(e) {
      throw new Error("Exception caught getting problem tag by id");
    }

    return problemIds;
  }
}
