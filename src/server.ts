import express, { Request, Response } from 'express';
import env from './config/environment';
import { connectDB } from './config/db';

const app = express();

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
});
