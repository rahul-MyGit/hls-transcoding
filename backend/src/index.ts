import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { PORT } from "./config";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())


app.get('/health', (_, res) => {
    res.send('Server is running');
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})