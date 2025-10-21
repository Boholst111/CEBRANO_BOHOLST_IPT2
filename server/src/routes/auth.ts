import express from 'express';
import { login, logout, getProfile } from '../controllers/authController';
import { validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);

export default router;
