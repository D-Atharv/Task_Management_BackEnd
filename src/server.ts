import express, { Request, Response } from 'express';
import env from './config/environment';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
});
