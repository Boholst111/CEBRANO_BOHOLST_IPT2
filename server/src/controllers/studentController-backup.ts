import { Request, Response } from 'express';
import { StudentModel } from '../models/Student-mysql';

export const getStudents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const result = await StudentModel.findAll(page, limit, search);
        
        res.json({
            students: result.students,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: Math.ceil(result.total / limit)
            }
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStudent = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const student = await StudentModel.findById(id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ student });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        // Check if student ID already exists
        const existingStudent = await StudentModel.findByStudentId(req.body.student_id);
        if (existingStudent) {
            return res.status(400).json({ error: 'Student ID already exists' });
        }

        // Check if email already exists
        const existingEmail = await StudentModel.findByEmail(req.body.email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const student = await StudentModel.create({
            ...req.body,
            status: req.body.status || 'active'
        });

        if (!student) {
            return res.status(500).json({ error: 'Failed to create student' });
        }

        res.status(201).json({
            message: 'Student created successfully',
            student
        });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        // Check if student exists
        const existingStudent = await StudentModel.findById(id);
        if (!existingStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if student ID is being changed and already exists
        if (req.body.student_id && req.body.student_id !== existingStudent.student_id) {
            const duplicateStudent = await StudentModel.findByStudentId(req.body.student_id);
            if (duplicateStudent) {
                return res.status(400).json({ error: 'Student ID already exists' });
            }
        }

        // Check if email is being changed and already exists
        if (req.body.email && req.body.email !== existingStudent.email) {
            const duplicateEmail = await StudentModel.findByEmail(req.body.email);
            if (duplicateEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        const student = await StudentModel.update(id, req.body);

        if (!student) {
            return res.status(500).json({ error: 'Failed to update student' });
        }

        res.json({
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        const deleted = await StudentModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStudentStats = async (req: Request, res: Response) => {
    try {
        const stats = await StudentModel.getStats();
        res.json({ stats });
    } catch (error) {
        console.error('Get student stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
