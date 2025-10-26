import { Request, Response } from 'express';
import { query } from '../config/mysql-database';

export const getCourses = async (req: Request, res: Response) => {
    try {
        const result: any = await query(`
            SELECT c.*, d.name as department_name 
            FROM courses c 
            LEFT JOIN departments d ON c.department_id = d.id 
            ORDER BY c.name
        `);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch courses' 
        });
    }
};

export const getCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result: any = await query(`
            SELECT c.*, d.name as department_name 
            FROM courses c 
            LEFT JOIN departments d ON c.department_id = d.id 
            WHERE c.id = ?
        `, [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Course not found' 
            });
        }
        
        res.json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch course' 
        });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { name, code, department_id, credits, description } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ 
                success: false,
                error: 'Name and code are required' 
            });
        }
        
        const result: any = await query(
            'INSERT INTO courses (name, code, department_id, credits, description) VALUES (?, ?, ?, ?, ?)',
            [name, code, department_id || null, credits || 3, description || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: {
                id: result.insertId,
                name,
                code,
                department_id,
                credits,
                description
            }
        });
    } catch (error: any) {
        console.error('Create course error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false,
                message: 'Course code already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Failed to create course' 
        });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, department_id, credits, description } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ 
                success: false,
                error: 'Name and code are required' 
            });
        }
        
        const result: any = await query(
            'UPDATE courses SET name = ?, code = ?, department_id = ?, credits = ?, description = ? WHERE id = ?',
            [name, code, department_id || null, credits || 3, description || null, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Course not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Course updated successfully'
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update course' 
        });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result: any = await query('DELETE FROM courses WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Course not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete course' 
        });
    }
};
