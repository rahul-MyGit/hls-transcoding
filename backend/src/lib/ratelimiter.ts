import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5, 
    message: 'Too many requests, please try again later.',
});

export default limiter;