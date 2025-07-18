import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from "express";

import { connectToDB } from './database/db'
import userRoutes from './routes/user-routes';

const app: Express = express();
connectToDB();

const PORT = process.env.PORT

app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

