import express from 'express';
import {
  getMyShelter,
  createShelter,
  updateShelter,
  updateAvailability,
  getAllShelters,
  deleteShelter
} from '../controllers/shelter.controller.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllShelters);

// Protected routes (shelter only)
router.delete('/:id', authenticateToken, requireRole('shelter'), deleteShelter);
router.get('/my', authenticateToken, requireRole('shelter'), getMyShelter);
router.post('/', authenticateToken, requireRole('shelter'), createShelter);
router.put('/:id', authenticateToken, requireRole('shelter'), updateShelter);
router.put('/:id/availability', authenticateToken, requireRole('shelter'), updateAvailability);

export default router;