import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../lib/ApiResponse';

const prisma = new PrismaClient();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token;
  if (!token) return ApiResponse(res, 401, false, 'Not authenticated');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) return ApiResponse(res, 401, false, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    res.status(401).json({ error: 'Invalid token' });
  }
};