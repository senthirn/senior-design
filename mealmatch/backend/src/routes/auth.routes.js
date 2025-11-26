import express from 'express';
import { register, login, refreshToken, getCurrentUser, logout } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

export default router;
