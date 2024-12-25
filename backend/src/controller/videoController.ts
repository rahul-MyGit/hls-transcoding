import { Request, Response } from "express";
import { ApiResponse } from "../lib/ApiResponse";
import { getAllVideosStatus, getVideoStatus, updateVideoStatusToComplete } from "../lib/redis";

export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const video = await getAllVideosStatus();
        res.json({ video })
        return;
    } catch (error) {
        return ApiResponse(res, 400, false, 'Invalid input');
    }
}

export const getStatus = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const status = await getVideoStatus(id);
        res.json({ status })
        return;
    } catch (error) {
        return ApiResponse(res, 400, false, 'Invalid input');
    }
}

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const {id } = req.body;
        const status = await updateVideoStatusToComplete(id);
        res.json({ status })
        return;
    } catch (error) {
        return ApiResponse(res, 400, false, 'Invalid input');
    }
}