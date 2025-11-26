import express from 'express';
import {
  searchMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getRestaurantMeals
} from '../controllers/meal.controller.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (with optional auth for analytics)
router.get('/', optionalAuth, searchMeals);
router.get('/:id', optionalAuth, getMealById);

// Protected routes (restaurant only)
router.post('/', authenticateToken, requireRole('restaurant'), createMeal);
router.put('/:id', authenticateToken, requireRole('restaurant'), updateMeal);
router.delete('/:id', authenticateToken, requireRole('restaurant'), deleteMeal);
router.get('/restaurant/:restaurantId', authenticateToken, requireRole('restaurant'), getRestaurantMeals);

export default router;