import dotenv from "dotenv";

dotenv.config();

export const REDIS_URL = process.env.REDIS_URL || "";
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL || "";
export const AWS_REGION = process.env.AWS_REGION || "";
