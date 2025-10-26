import express from 'express';
import {
    getAcademicYears,
    getAcademicYear,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear
} from '../controllers/academicYearsController';

const router = express.Router();

// Public routes (no authentication required for now)
router.get('/', getAcademicYears);
router.get('/:id', getAcademicYear);
router.post('/', createAcademicYear);
router.put('/:id', updateAcademicYear);
router.delete('/:id', deleteAcademicYear);

export default router;
