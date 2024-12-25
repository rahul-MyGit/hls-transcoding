import Redis from "ioredis";
import { REDIS_URL } from "../config";

interface VideoStatus {
    key: string;
    status: string | null;
}

const redis = new Redis(REDIS_URL);

export const markAsUploading = async (key: string): Promise<void> => {
    await redis.set(`videos:${key}:status`, "uploading");
};

export const getVideoStatus = async (key: string): Promise<string | null> => {
    return await redis.get(`videos:${key}:status`);
};

export const getAllVideosStatus = async (): Promise<VideoStatus[]> => {
    let cursor = "0";
    const allStatus: VideoStatus[] = [];

    do {
        const [nextCursor, key] = await redis.scan(cursor, "MATCH", "videos:*:status", "COUNT", 1000);
        cursor = nextCursor;
        if (key.length > 0) {
            const values = await redis.mget(...key);
            allStatus.push(...key.map((key, index) => ({
                key,
                status: values[index]
            })));
        }
    } while (cursor !== "0");

    return allStatus;
};

export const updateVideoStatusToComplete = async (key: string): Promise<void> => {
    await redis.set(`videos:${key}:status`, "uploaded");
};