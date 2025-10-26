import { Request, Response } from 'express';
import { query } from '../config/mysql-database';

export const getAcademicYears = async (req: Request, res: Response) => {
    try {
        // Get distinct academic years from students table
        const result: any = await query('SELECT DISTINCT academic_year as name FROM students WHERE academic_year IS NOT NULL AND academic_year != "" ORDER BY academic_year DESC');
        
        // Transform to expected format
        const academicYears = result.map((row: any) => ({
            id: row.name, // Use the academic year string as ID
            name: row.name,
            start_year: row.name.split('-')[0],
            end_year: row.name.split('-')[1]
        }));
        
        res.json({
            success: true,
            data: academicYears
        });
    } catch (error) {
        console.error('Get academic years error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch academic years' 
        });
    }
};

export const getAcademicYear = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result: any = await query('SELECT * FROM academic_years WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Academic year not found' 
            });
        }
        
        res.json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error('Get academic year error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch academic year' 
        });
    }
};

export const createAcademicYear = async (req: Request, res: Response) => {
    try {
        // Accept both start_year and year_start, end_year and year_end
        const name = req.body.name;
        const start_year = req.body.start_year || req.body.year_start;
        const end_year = req.body.end_year || req.body.year_end;
        const is_current = req.body.is_current;
        
        if (!name || !start_year || !end_year) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, start year, and end year are required' 
            });
        }
        
        const result: any = await query(
            'INSERT INTO academic_years (name, start_year, end_year, is_current) VALUES (?, ?, ?, ?)',
            [name, start_year, end_year, is_current ? 1 : 0]
        );
        
        res.status(201).json({
            success: true,
            message: 'Academic year created successfully',
            data: {
                id: result.insertId,
                name,
                start_year,
                end_year,
                is_current
            }
        });
    } catch (error: any) {
        console.error('Create academic year error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create academic year' 
        });
    }
};

export const updateAcademicYear = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Accept both start_year and year_start, end_year and year_end
        const name = req.body.name;
        const start_year = req.body.start_year || req.body.year_start;
        const end_year = req.body.end_year || req.body.year_end;
        const is_current = req.body.is_current;
        
        if (!name || !start_year || !end_year) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, start year, and end year are required' 
            });
        }
        
        const result: any = await query(
            'UPDATE academic_years SET name = ?, start_year = ?, end_year = ?, is_current = ? WHERE id = ?',
            [name, start_year, end_year, is_current ? 1 : 0, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Academic year not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Academic year updated successfully'
        });
    } catch (error) {
        console.error('Update academic year error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update academic year' 
        });
    }
};

export const deleteAcademicYear = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result: any = await query('DELETE FROM academic_years WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Academic year not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Academic year deleted successfully'
        });
    } catch (error) {
        console.error('Delete academic year error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete academic year' 
        });
    }
};
