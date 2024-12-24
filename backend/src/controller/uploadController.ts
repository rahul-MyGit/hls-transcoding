import { Request, Response } from "express";
import { ApiResponse } from "../lib/ApiResponse";
import { getPreSignUrl } from "../lib/aws";
import { markAsUploading } from "../lib/redis";

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const preSignUrl = await getPreSignUrl(req.body.filename);
        if (!preSignUrl) return ApiResponse(res, 500, false, 'Failed to get presign url');
        await markAsUploading(req.body.filename);
        res.status(200).json({ 
            success: true, 
            message: 'Presign url generated', 
            presignUrl: preSignUrl
         });
        return;
    } catch (error) {
        return ApiResponse(res, 400, false, 'Invalid input');
    }
}
