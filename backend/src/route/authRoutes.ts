import { Router } from 'express';
import passport from 'passport';
import { signin, logout, signup, handleGoogleCallback } from '../controller/authController';
import {authMiddleware} from '../middleware/protectRoute';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', authMiddleware, logout);

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email']
}));
 
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  handleGoogleCallback
);

export default router;