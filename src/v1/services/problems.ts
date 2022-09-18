import { IProblem, Problems } from '../models/problems';
import { logger } from '../../logger';

export interface ProblemData {
  title: string;
  title_slug: string;
  id: Number;
  difficulty: Number;
  is_premium: boolean;
};

export class ProblemService {
  public static async getAllProblems() : Promise<ProblemData[] | Error> {
    let data : IProblem[];
    
    try {
      data = await Problems.find({});
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problems from database: " + e);
      return new Error("Error retrieving problems " + e);
    }

    const parsedData : ProblemData[] = data.map(problem  => { 
      return {
        title: problem.title,
        title_slug: problem.titleSlug,
        id: problem.problemId,
        difficulty: problem.difficulty,
        is_premium: problem.isPremium
      };
    });

    return parsedData;
  }
}