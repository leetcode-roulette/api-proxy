import { config } from 'dotenv';
import express, { Application } from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import v1Router from "./v1/routes";

config();

export const app : Application = (() : Application => {
    const app: Application = express();
    app.use(express.json());
    app.set('json spaces', 2)
    app.use("/v1", v1Router);
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return app;
})();