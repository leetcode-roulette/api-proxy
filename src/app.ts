import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import v1Router from './v1/routes';

config();

const app: Application = express();

app.use("/v1", v1Router);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Welcome to the Leetcode Roulette API');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});