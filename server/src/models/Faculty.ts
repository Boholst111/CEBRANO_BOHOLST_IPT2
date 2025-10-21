import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Faculty {
    id?: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    hire_date: string;
    department?: string;
    position?: string;
    salary?: number;
    status: string;
    qualifications?: string;
    specialization?: string;
    office_location?: string;
    created_at?: string;
    updated_at?: string;
}

interface FacultyRow extends RowDataPacket, Faculty {}

export class FacultyModel {
    static async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ faculty: Faculty[], total: number }> {
        try {
            let query = 'SELECT * FROM faculty';
            let countQuery = 'SELECT COUNT(*) as total FROM faculty';
            const params: any[] = [];

            if (search) {
                const searchCondition = ` WHERE first_name LIKE ? OR last_name LIKE ? OR employee_id LIKE ? OR email LIKE ? OR department LIKE ? OR position LIKE ?`;
                query += searchCondition;
                countQuery += searchCondition;
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            const offset = (page - 1) * limit;
            
            const [faculty] = await pool.execute<FacultyRow[]>(query, [...params, limit, offset]);
            const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, params);
            const total = countResult[0].total;

            return { faculty, total };
        } catch (error) {
            console.error('Error finding faculty:', error);
            return { faculty: [], total: 0 };
        }
    }

    static async findById(id: number): Promise<Faculty | undefined> {
        try {
            const [rows] = await pool.execute<FacultyRow[]>(
                'SELECT * FROM faculty WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding faculty by id:', error);
            return undefined;
        }
    }

    static async findByEmployeeId(employeeId: string): Promise<Faculty | undefined> {
        try {
            const [rows] = await pool.execute<FacultyRow[]>(
                'SELECT * FROM faculty WHERE employee_id = ?',
                [employeeId]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding faculty by employee_id:', error);
            return undefined;
        }
    }

    static async findByEmail(email: string): Promise<Faculty | undefined> {
        try {
            const [rows] = await pool.execute<FacultyRow[]>(
                'SELECT * FROM faculty WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding faculty by email:', error);
            return undefined;
        }
    }

    static async create(faculty: Omit<Faculty, 'id' | 'created_at' | 'updated_at'>): Promise<Faculty | undefined> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                `INSERT INTO faculty (
                    employee_id, first_name, last_name, email, phone, date_of_birth,
                    gender, address, hire_date, department, position, salary, status,
                    qualifications, specialization, office_location
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    faculty.employee_id,
                    faculty.first_name,
                    faculty.last_name,
                    faculty.email,
                    faculty.phone,
                    faculty.date_of_birth,
                    faculty.gender,
                    faculty.address,
                    faculty.hire_date,
                    faculty.department,
                    faculty.position,
                    faculty.salary,
                    faculty.status,
                    faculty.qualifications,
                    faculty.specialization,
                    faculty.office_location
                ]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Error creating faculty:', error);
            return undefined;
        }
    }

    static async update(id: number, updates: Partial<Faculty>): Promise<Faculty | undefined> {
        try {
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => (updates as any)[field]);
            
            await pool.execute(
                `UPDATE faculty SET ${setClause} WHERE id = ?`,
                [...values, id]
            );
            
            return this.findById(id);
        } catch (error) {
            console.error('Error updating faculty:', error);
            return undefined;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                'DELETE FROM faculty WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting faculty:', error);
            return false;
        }
    }

    static async getStats(): Promise<any> {
        try {
            const [totalResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM faculty WHERE status = "active"'
            );
            const [departmentResult] = await pool.execute<RowDataPacket[]>(
                `SELECT department, COUNT(*) as count 
                 FROM faculty 
                 WHERE status = "active" 
                 GROUP BY department`
            );
            const [positionResult] = await pool.execute<RowDataPacket[]>(
                `SELECT position, COUNT(*) as count 
                 FROM faculty 
                 WHERE status = "active" 
                 GROUP BY position`
            );

            return {
                total: totalResult[0].total,
                byDepartment: departmentResult,
                byPosition: positionResult
            };
        } catch (error) {
            console.error('Error getting faculty stats:', error);
            return { total: 0, byDepartment: [], byPosition: [] };
        }
    }
}
