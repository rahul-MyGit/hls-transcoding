import { NODE_ENV } from ".";

export const cookieConfig = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict' as const
  };