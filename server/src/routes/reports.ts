import express from 'express';
import { getStudentReport, getFacultyReport } from '../controllers/reportsController';

const router = express.Router();

// Public routes (no authentication required for testing)
router.get('/students', getStudentReport);
router.get('/faculty', getFacultyReport);

export default router;
