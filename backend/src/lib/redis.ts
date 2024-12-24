import Redis from "ioredis";
import { REDIS_URL } from "../config";

const redis = new Redis(REDIS_URL);

export const markAsUploading = async (key: string) => {
  await redis.set(`video:${key}:status`, "uploading");
};
