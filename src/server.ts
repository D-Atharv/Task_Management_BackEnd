import express, { Request, Response } from 'express';
import env from './config/environment';
import { connectDB } from './config/db';
import routes from './routes';
import cors from 'cors'; 

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};

connectDB();

app
  .use(cors(corsOptions)) 
  .use(express.json())
  .use('/', routes);

app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
