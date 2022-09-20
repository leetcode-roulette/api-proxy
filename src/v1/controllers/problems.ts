import { Request, Response } from "express";
import { ResponseJson, ProblemService, Query } from "../services";
import { Params } from "../services";

export class ProblemController {
  public static async getAllProblems(req: Request<{}, {}, {}, Query>, res: Response) : Promise<any> {
    let responseJson  : ResponseJson;

    try {
      responseJson = await ProblemService.getAllProblems(req);
    } catch (e : any) {
      res.status(e.statusCode || 500).json({
        message: "Unexpected error getting problems",
        error: e.message
      });
      return e;
    }

    res.status(200).json(responseJson);
  }

  public static async getProblemById(req: Request<Params, {}, {}, Query>, res: Response) : Promise<any> {
    let responseJson : ResponseJson;

    try {
      responseJson = await ProblemService.getProblemById(req);
    } catch(e : any) {
      res.status(e.statusCode || 500).json({
        message: "Unexpected error getting problem by id",
        error: e.message
      });
      return e;
    }

    res.status(200).json(responseJson);
  }
}