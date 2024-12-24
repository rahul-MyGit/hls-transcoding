import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string()
});