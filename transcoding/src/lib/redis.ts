import  {Redis}  from "ioredis";
import { REDIS_URL } from "../config";

const redis = new Redis(REDIS_URL);

type videoTranscodingType = "processing" | "uploaded" | "failed";

export const markAsProcessing = async (key: string, value: videoTranscodingType): Promise<void> => {
    await redis.set(key, value);
}
