import { axiosClient } from './axios-client';
import { ProblemData, LeetcodeProblem } from './interfaces';

export class ProblemExtractor {
  private static parsedData : Promise<ProblemData[] | null> | null = null;

  public static get problems() : Promise<ProblemData[] | null> | null {
    if (this.parsedData === null) {
      this.parsedData = this.makeAPICallAndGetData();
    }

    return this.parsedData;
  }

  private static async makeAPICallAndGetData() : Promise<ProblemData[] | null> {
    const data = await axiosClient.get("/api/problems/all");
    const problemData : LeetcodeProblem[] = data.data.stat_status_pairs;
    
    const parsedData : ProblemData[] = problemData.map(problem => {
      const questionInfo = problem.stat;

      return {
        question_id: questionInfo.question_id,
        question__title_slug: questionInfo.question__title_slug,
        question__title: questionInfo.question__title,
        total_acs: questionInfo.total_acs,
        total_submitted: questionInfo.total_submitted,
        frontend_question_id: questionInfo.frontend_question_id,
      }
    });

    return parsedData;
  }
}
