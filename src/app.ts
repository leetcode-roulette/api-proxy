import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import v1Router from './v1/routes';
import { Database } from './v1/db/db.config';
import { PopulateProblems } from './v1/db/problems';

config();

const serve = async () : Promise<void> => {
    const app: Application = express();

    await Database.connect();

    app.use("/v1", v1Router);
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    await PopulateProblems.populate();
}

serve();