import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const GOOGLE_CLIENT_ID= process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET= process.env.GOOGLE_CLIENT_SECRET;
export const JWT_SECRET= process.env.JWT_SECRET || 'secret';
export const NODE_ENV= process.env.NODE_ENV || 'development';
export const FRONTEND_URL= process.env.FRONTEND_URL || 'http://localhost:3000';

export const AWS_ACCESS_KEY_ID= process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY= process.env.AWS_SECRET_ACCESS_KEY || "";
export const REDIS_URL= process.env.REDIS_URL || "redis://localhost:6379";