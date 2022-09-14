import { Handler, Request, Response } from "express";

const healthcheck : Handler = (req: Request, res: Response) => {
  const VERSION : string = process.env.VERSION || "1.0.0";
  const ENVIRONMENT : string = process.env.ENVIRONMENT || "dev";

  res.status(200).json({
    version: VERSION,
    environment: ENVIRONMENT,
    status: "Live"
  });
};

export default healthcheck;