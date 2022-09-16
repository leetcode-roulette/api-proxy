import { Request, Response } from "express";
import { ProblemData, ProblemService } from "../services";

export class ProblemController {
  public static async getAllProblems(req: Request, res: Response) {
    let problems  : ProblemData[] | Error;

    try {
      problems = await ProblemService.getAllProblems();
    } catch (e) {
      res.status(500).json({
        message: "Unexpected error getting problems",
        error: e
      });
      return e;
    }

    res.status(200).json({
      message: "Successfully fetched problems",
      questions: problems
    });
  }
}