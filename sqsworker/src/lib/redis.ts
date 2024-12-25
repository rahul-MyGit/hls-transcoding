import { Redis } from "ioredis";
import { REDIS_URL } from "../config";

const redis = new Redis(REDIS_URL);

export type VideoProcessingStatus = "processing" | "uploaded" | "failed";

export const markAsProcessing = async (key: string, value: VideoProcessingStatus): Promise<void> => {
    console.log('mark as processing', key, value);    
    await redis.set(key, value);
}