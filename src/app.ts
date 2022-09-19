import { config } from 'dotenv';
import express, { Application } from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import v1Router from './v1/routes';
import { Database } from './v1/db/db.config';
import { logger } from './logger';

config();

const serve = async () : Promise<void> => {
    const app: Application = express();
    app.use(express.json());

    try {
        await Database.connect();
    } catch(e) {
        logger.error("Exception caught while trying to connect to database: " + e);
    }

    app.use("/v1", v1Router);
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        logger.info(`Server is listening on port ${PORT}`);
    });
}

serve();