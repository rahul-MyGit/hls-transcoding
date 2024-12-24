import { Response } from "express";

export const ApiResponse = (res: Response, code: number, success: boolean, message: string) => {
    res.status(code).json({
        success,
        message
    });
    return;
}