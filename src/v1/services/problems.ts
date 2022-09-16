import { ProblemExtractor } from "../../packages/problem-extractor";
import { LeetcodeProblem } from "../../packages/problem-extractor/interfaces";

export interface ProblemData {
  title: string;
  title_slug: string;
  id: number;
  difficulty: number;
  is_premium: boolean;
};

export class ProblemService {
  private static data : Promise<LeetcodeProblem[] | null> | null = null;

  public static async getAllProblems() : Promise<ProblemData[] | Error> {
    let data : LeetcodeProblem[] | null;

    try {
      data = await this.problems;

      if (data === null) {
        throw("Unable to fetch problems from leetcode");
      }
    } catch(e : any) {
      return e;
    }

    const parsedData : ProblemData[] = data.map(problem  => { 
      return {
        title: problem.stat.question__title,
        title_slug: problem.stat.question__title_slug,
        id: problem.stat.question_id,
        difficulty: problem.difficulty.level,
        is_premium: problem.paid_only
      };
    });

    return parsedData;
  }

  public static get problems() : Promise<LeetcodeProblem[] | null> | null {
    if (this.data === null) {
      this.data = ProblemExtractor.problems;
    }

    return this.data;
  }
}