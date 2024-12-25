import dotenv from "dotenv";

dotenv.config();

export const ECS_TASK_ARN = process.env.ECS_TASK_ARN
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || ""
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ""
export const AWS_REGION = process.env.AWS_REGION || ""
export const REDIS_URL = process.env.REDIS_URL || ""

export const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN

export const VIDEO_BUCKET = process.env.VIDEO_BUCKET || ""
export const VIDEO_KEY = process.env.VIDEO_KEY || ""

export const INPUT_FILE_PATH = "/tmp/input.mp4"
export const OUTPUT_FILE_PATH = "/tmp/output"
export const RESOLUTION = ["720p", "480p", "360p"];
export const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET || ""
