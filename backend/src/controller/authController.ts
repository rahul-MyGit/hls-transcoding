import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signupSchema, signinSchema } from '../config/zod';
import { cookieConfig } from '../config/cookie';
import { FRONTEND_URL, JWT_SECRET } from '../config';
import prisma from '../db';
import { ApiResponse } from '../lib/ApiResponse';
import { User } from '../config/types';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = signupSchema.parse(req.body);

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) return ApiResponse(res, 400, false, 'Email or username already exists')

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.cookie('auth_token', token, cookieConfig);
        res.json({ message: 'Signup successful' });
        return;
    } catch (error) {
        ApiResponse(res, 400, false, 'Invalid input');
        return;
    }
}


export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = signinSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return ApiResponse(res, 401, false, 'Invalid credentials')

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return ApiResponse(res, 401, false, 'Invalid credentials')

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.cookie('auth_token', token, cookieConfig);
        res.json({ message: 'Login successful' });
    } catch (error) {
        return ApiResponse(res, 400, false, 'Invalid input');
    }
}

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
}

export const handleGoogleCallback = (req: Request, res: Response) => {
    const user = req.user as User;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie('auth_token', token, cookieConfig);
    res.redirect(FRONTEND_URL || '/');
}
