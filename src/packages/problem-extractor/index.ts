import { AxiosResponse } from 'axios';
import { axiosClient } from './axios-client';
import { LeetcodeProblem } from './interfaces';

export class ProblemExtractor {
  private static parsedData : Promise<LeetcodeProblem[] | null> | null = null;

  public static get problems() : Promise<LeetcodeProblem[] | null> | null {
    if (this.parsedData === null) {
      this.parsedData = this.makeAPICallAndGetData();
    }

    return this.parsedData;
  }

  private static async makeAPICallAndGetData() : Promise<LeetcodeProblem[] | null> {
    const data : AxiosResponse = await axiosClient.get("/api/problems/all");
    const parsedData : LeetcodeProblem[] = data.data.stat_status_pairs;

    return parsedData;
  }
}
