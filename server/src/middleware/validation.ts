import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

export const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

export const validateStudent = [
    body('student_id').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('course_id').optional().isInt().withMessage('Course ID must be a number'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number'),
    body('academic_year').optional().notEmpty().withMessage('Academic year is required'),
    body('phone').optional(),
    body('address').optional(),
    handleValidationErrors
];

export const validateStudentUpdate = [
    body('student_id').optional().notEmpty().withMessage('Student ID cannot be empty'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().notEmpty().withMessage('Password cannot be empty'),
    body('course_id').optional().isInt().withMessage('Course ID must be a number'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number'),
    body('academic_year').optional(),
    body('enrollment_date').optional(), // Allow but don't validate since it's not stored
    body('phone').optional(),
    body('address').optional(),
    handleValidationErrors
];

export const validateFaculty = [
    body('employee_id').notEmpty().withMessage('Employee ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number'),
    body('position').optional().notEmpty().withMessage('Position is required'),
    body('employment_type').optional().isIn(['full_time', 'part_time', 'contract']).withMessage('Invalid employment type'),
    body('hire_date').optional().isDate().withMessage('Valid hire date is required'),
    body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
    body('qualifications').optional(),
    body('specializations').optional(),
    body('office_location').optional(),
    body('phone').optional(),
    body('address').optional(),
    handleValidationErrors
];

export const validateFacultyUpdate = [
    body('employee_id').optional().notEmpty().withMessage('Employee ID cannot be empty'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().notEmpty().withMessage('Password cannot be empty'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number'),
    body('position').optional(),
    body('employment_type').optional().isIn(['full_time', 'part_time', 'contract']).withMessage('Invalid employment type'),
    body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
    body('qualifications').optional(),
    body('specializations').optional(),
    body('phone').optional(),
    body('address').optional(),
    handleValidationErrors
];
