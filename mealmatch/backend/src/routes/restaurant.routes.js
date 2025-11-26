import express from 'express';
import { getMyRestaurant, createRestaurant } from '../controllers/restaurant.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes (restaurant only)
router.get('/my', authenticateToken, requireRole('restaurant'), getMyRestaurant);
router.post('/', authenticateToken, requireRole('restaurant'), createRestaurant);

export default router;