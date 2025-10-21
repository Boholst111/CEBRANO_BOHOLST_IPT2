import express from 'express';
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats
} from '../controllers/studentController-mysql';
import { validateStudent, validateStudentUpdate } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.get('/stats', getStudentStats);
router.get('/', getStudents);  // Temporarily make this public for testing
router.get('/:id', getStudent);  // Temporarily make this public for testing
router.post('/', validateStudent, createStudent);  // Temporarily make this public for testing
router.put('/:id', validateStudentUpdate, updateStudent);  // Temporarily make this public for testing
router.delete('/:id', deleteStudent);  // Temporarily make this public for testing

// All other routes require authentication
router.use(authenticateToken);

export default router;
