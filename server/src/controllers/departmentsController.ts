import { Request, Response } from 'express';
import { query } from '../config/mysql-database';

export const getDepartments = async (req: Request, res: Response) => {
    try {
        const result: any = await query('SELECT * FROM departments ORDER BY name');
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch departments' 
        });
    }
};

export const getDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result: any = await query('SELECT * FROM departments WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Department not found' 
            });
        }
        
        res.json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error('Get department error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch department' 
        });
    }
};

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const { name, code, description } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ 
                success: false,
                error: 'Name and code are required' 
            });
        }
        
        const result: any = await query(
            'INSERT INTO departments (name, code, description) VALUES (?, ?, ?)',
            [name, code, description || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: {
                id: result.insertId,
                name,
                code,
                description
            }
        });
    } catch (error: any) {
        console.error('Create department error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false,
                message: 'Department code already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Failed to create department' 
        });
    }
};

export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, description } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ 
                success: false,
                error: 'Name and code are required' 
            });
        }
        
        const result: any = await query(
            'UPDATE departments SET name = ?, code = ?, description = ? WHERE id = ?',
            [name, code, description || null, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Department not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Department updated successfully'
        });
    } catch (error) {
        console.error('Update department error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update department' 
        });
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result: any = await query('DELETE FROM departments WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Department not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete department' 
        });
    }
};
