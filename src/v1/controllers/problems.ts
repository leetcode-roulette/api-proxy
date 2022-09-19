import { Request, Response } from "express";
import { ResponseJson, ProblemService, Query } from "../services";

export class ProblemController {
  public static async getAllProblems(req: Request<{}, {}, {}, Query>, res: Response) {
    let responseJson  : ResponseJson;

    try {
      responseJson = await ProblemService.getAllProblems(req);
    } catch (e) {
      res.status(500).json({
        message: "Unexpected error getting problems",
        error: e
      });
      return e;
    }

    res.status(200).json(responseJson);
  }
}