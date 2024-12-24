import express from "express";
import { authMiddleware } from "../middleware/protectRoute";
import { uploadVideo } from "../controller/uploadController";

const uploadRouter = express.Router();

uploadRouter.post('/upload', authMiddleware, uploadVideo);

export default uploadRouter;