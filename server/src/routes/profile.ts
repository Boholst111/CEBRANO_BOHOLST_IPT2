import express from 'express';
import { getProfile, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/', authenticateToken, getProfile);

// Update profile
router.put('/', authenticateToken, updateProfile);

export default router;
