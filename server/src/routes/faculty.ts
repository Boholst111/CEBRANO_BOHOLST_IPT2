import express from 'express';
import {
    getFaculty,
    getFacultyMember,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyStats
} from '../controllers/facultyController-mysql';
import { validateFaculty, validateFacultyUpdate } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.get('/stats', getFacultyStats);
router.get('/', getFaculty);  // Temporarily make this public for testing
router.get('/:id', getFacultyMember);  // Temporarily make this public for testing
router.post('/', validateFaculty, createFaculty);  // Temporarily make this public for testing
router.put('/:id', validateFacultyUpdate, updateFaculty);  // Temporarily make this public for testing
router.delete('/:id', deleteFaculty);  // Temporarily make this public for testing

// All other routes require authentication
router.use(authenticateToken);

export default router;
