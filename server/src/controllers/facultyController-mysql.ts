import { Request, Response } from 'express';
import { FacultyModel } from '../models/Faculty-mysql';

export const getFaculty = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const departmentId = req.query.department_id ? parseInt(req.query.department_id as string) : undefined;

        const result = await FacultyModel.findAll(page, limit, search, departmentId);
        
        res.json({
            faculty: result.faculty,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: Math.ceil(result.total / limit)
            }
        });
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFacultyMember = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const faculty = await FacultyModel.findById(id);

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        res.json({ faculty });
    } catch (error) {
        console.error('Get faculty member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createFaculty = async (req: Request, res: Response) => {
    try {
        const { 
            name, email, password, employee_id, department_id, position, 
            employment_type, hire_date, salary, qualifications, specializations, 
            office_location, phone, address 
        } = req.body;

        // Check if employee ID already exists
        const existingFaculty = await FacultyModel.findByEmployeeId(employee_id);
        if (existingFaculty) {
            return res.status(400).json({ error: 'Employee ID already exists' });
        }

        // Check if email already exists
        const existingEmail = await FacultyModel.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // First create a user record
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { pool } = await import('../config/mysql-database');
        const [userResult] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'faculty']
        );
        
        const userId = (userResult as any).insertId;

        // Then create the faculty record
        const faculty = await FacultyModel.create({
            user_id: userId,
            employee_id,
            department_id: department_id ? parseInt(department_id) : undefined,
            position,
            employment_type: employment_type || 'full_time',
            salary: salary ? parseFloat(salary) : undefined,
            phone,
            address,
            qualifications,
            specializations
        });

        if (!faculty) {
            return res.status(500).json({ error: 'Failed to create faculty member' });
        }

        res.status(201).json({
            message: 'Faculty member created successfully',
            faculty
        });
    } catch (error) {
        console.error('Create faculty error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateFaculty = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        // Check if faculty exists
        const existingFaculty = await FacultyModel.findById(id);
        if (!existingFaculty) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        // Check if employee ID is being changed and already exists
        if (req.body.employee_id && req.body.employee_id !== existingFaculty.employee_id) {
            const duplicateFaculty = await FacultyModel.findByEmployeeId(req.body.employee_id);
            if (duplicateFaculty) {
                return res.status(400).json({ error: 'Employee ID already exists' });
            }
        }

        // Check if email is being changed and already exists
        if (req.body.email && req.body.email !== existingFaculty.user_email) {
            const duplicateEmail = await FacultyModel.findByEmail(req.body.email);
            if (duplicateEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        // Transform frontend data to database format
        const { 
            name, email, password, employee_id, department_id, position, 
            employment_type, salary, qualifications, specializations, phone, address 
        } = req.body;
        
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
                updateValues.push(existingFaculty.user_id);
                await pool.execute(
                    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                    updateValues
                );
            }
        }

        // Then update the faculty record - only include fields that have values
        const facultyUpdateData: any = {};
        
        if (employee_id !== undefined) facultyUpdateData.employee_id = employee_id;
        if (department_id !== undefined) facultyUpdateData.department_id = parseInt(department_id);
        if (position !== undefined) facultyUpdateData.position = position;
        if (employment_type !== undefined) facultyUpdateData.employment_type = employment_type;
        if (salary !== undefined) facultyUpdateData.salary = parseFloat(salary);
        if (phone !== undefined) facultyUpdateData.phone = phone;
        if (address !== undefined) facultyUpdateData.address = address;
        if (qualifications !== undefined) facultyUpdateData.qualifications = qualifications;
        if (specializations !== undefined) facultyUpdateData.specializations = specializations;

        const faculty = await FacultyModel.update(id, facultyUpdateData);

        if (!faculty) {
            return res.status(500).json({ error: 'Failed to update faculty member' });
        }

        res.json({
            message: 'Faculty member updated successfully',
            faculty
        });
    } catch (error) {
        console.error('Update faculty error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteFaculty = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        const deleted = await FacultyModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFacultyStats = async (req: Request, res: Response) => {
    try {
        const stats = await FacultyModel.getStats();
        res.json({ stats });
    } catch (error) {
        console.error('Get faculty stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
