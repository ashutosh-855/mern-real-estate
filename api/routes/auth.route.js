import express from 'express';
import { google, signin, signout, signup, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, signup)
router.post('/signin', authLimiter, signin)
router.post('/google', google)
router.get('/signout', signout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router;