import { User } from '../config/types';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
} 