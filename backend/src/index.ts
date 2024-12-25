import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./route/authRoutes";

dotenv.config();

import { PORT } from "./config";
import cookieParser from "cookie-parser";
import uploadRouter from "./route/uploadRoutes";
import videoRouter from "./route/videoRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req: Request, res: Response) => {
    res.send('Server is running');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/video', videoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});