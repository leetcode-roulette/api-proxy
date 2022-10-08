import { Request, Response } from "express";
import { TagsService, ExpressQuery, ResponseJson } from "../services";

export class TagsController {
  public static async getAllTags(req: Request<{}, {}, {}, ExpressQuery>, res: Response) : Promise<any> {
    let responseJson  : ResponseJson;

    try {
      responseJson = await TagsService.getAllTags(req);
    } catch(e : any) {
      res.status(e.statusCode || 500).json({
        message: "Unexpected error getting problems",
        error: e.message
      });
      return e;
    }

    res.status(200).json(responseJson);
  }
}