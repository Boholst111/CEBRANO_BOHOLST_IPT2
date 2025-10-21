import { Request, Response } from 'express';
import { StudentModel } from '../models/Student-mysql';

export const getStudents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const departmentId = req.query.department_id ? parseInt(req.query.department_id as string) : undefined;
        const courseId = req.query.course_id ? parseInt(req.query.course_id as string) : undefined;

        const result = await StudentModel.findAll(page, limit, search, departmentId, courseId);
        
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
        const { name, email, password, student_id, course_id, department_id, academic_year, phone, address } = req.body;
        console.log('CREATE STUDENT - Request body:', req.body);
        console.log('CREATE STUDENT - Extracted values:', { name, email, student_id, course_id, department_id, academic_year });

        // Check if student ID already exists
        const existingStudent = await StudentModel.findByStudentId(student_id);
        if (existingStudent) {
            return res.status(400).json({ error: 'Student ID already exists' });
        }

        // Check if email already exists
        const existingEmail = await StudentModel.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // First create a user record
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { pool } = await import('../config/mysql-database');
        const [userResult] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'student']
        );
        
        const userId = (userResult as any).insertId;

        // Then create the student record
        const studentData = {
            user_id: userId,
            student_id,
            course_id: course_id ? parseInt(course_id) : undefined,
            department_id: department_id ? parseInt(department_id) : undefined,
            academic_year,
            phone,
            address
        };
        console.log('CREATE STUDENT - Data being saved:', studentData);
        
        const student = await StudentModel.create(studentData);

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
        if (req.body.email && req.body.email !== existingStudent.user_email) {
            const duplicateEmail = await StudentModel.findByEmail(req.body.email);
            if (duplicateEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        // Transform frontend data to database format
        const { name, email, password, student_id, course_id, department_id, academic_year, enrollment_date, phone, address } = req.body;
        console.log('Update student request body:', req.body);
        console.log('Existing student:', existingStudent);
        
        // First update the user record if name or email changed
        if (name || email || password) {
            const { pool } = await import('../config/mysql-database');
            const updateFields = [];
            const updateValues = [];
            
            if (name) {
                updateFields.push('name = ?');
                updateValues.push(name);
            }
            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }
            if (password) {
                const bcrypt = require('bcryptjs');
                const hashedPassword = await bcrypt.hash(password, 10);
                updateFields.push('password = ?');
                updateValues.push(hashedPassword);
            }
            
            if (updateFields.length > 0) {
                updateValues.push(existingStudent.user_id);
                await pool.execute(
                    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                    updateValues
                );
            }
        }

        // Then update the student record - only include fields that have values
        const studentUpdateData: any = {};
        
        if (student_id !== undefined) studentUpdateData.student_id = student_id;
        if (course_id !== undefined) studentUpdateData.course_id = parseInt(course_id);
        if (department_id !== undefined) studentUpdateData.department_id = parseInt(department_id);
        if (academic_year !== undefined) studentUpdateData.academic_year = academic_year;
        if (phone !== undefined) studentUpdateData.phone = phone;
        if (address !== undefined) studentUpdateData.address = address;

        console.log('Student update data being sent to model:', studentUpdateData);
        const student = await StudentModel.update(id, studentUpdateData);
        console.log('Student update result:', student);

        if (!student) {
            return res.status(500).json({ error: 'Failed to update student' });
        }

        res.json({
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error('Update student error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
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
