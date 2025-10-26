import express from 'express';
import { getStudentReport, getFacultyReport, downloadReport } from '../controllers/reportsController';

const router = express.Router();

// Public routes (no authentication required for testing)
router.get('/students', getStudentReport);
router.get('/faculty', getFacultyReport);
router.get('/download/:filename', downloadReport);

export default router;
