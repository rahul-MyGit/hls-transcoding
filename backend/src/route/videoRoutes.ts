import { Router } from "express";
import { getAllVideos, getStatus, updateStatus } from "../controller/videoController";

const videoRouter = Router();

videoRouter.get("/all", getAllVideos);
videoRouter.get("/:id", getStatus);
videoRouter.post("/updateStatus", updateStatus);

export default videoRouter;