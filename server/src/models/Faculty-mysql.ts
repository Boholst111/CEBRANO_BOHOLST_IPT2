import { pool } from '../config/mysql-database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Faculty {
    id?: number;
    user_id: number;
    employee_id: string;
    department_id?: number;
    position?: string;
    employment_type?: string;
    salary?: number;
    phone?: string;
    address?: string;
    qualifications?: string;
    specializations?: string;
    created_at?: string;
    updated_at?: string;
    // Joined fields from other tables
    user_name?: string;
    user_email?: string;
    department_name?: string;
}

interface FacultyRow extends RowDataPacket, Faculty {}

export class FacultyModel {
    static async findAll(page: number = 1, limit: number = 10, search?: string, departmentId?: number): Promise<{ faculty: Faculty[], total: number }> {
        try {
            let query = `
                SELECT 
                    f.id,
                    f.user_id,
                    f.employee_id,
                    f.department_id,
                    f.position,
                    f.employment_type,
                    f.salary,
                    f.phone,
                    f.address,
                    f.qualifications,
                    f.specializations,
                    f.created_at,
                    f.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    d.name as department_name
                FROM faculty f
                LEFT JOIN users u ON f.user_id = u.id
                LEFT JOIN departments d ON f.department_id = d.id
            `;
            
            let countQuery = 'SELECT COUNT(*) as total FROM faculty f LEFT JOIN users u ON f.user_id = u.id LEFT JOIN departments d ON f.department_id = d.id';
            const params: any[] = [];
            const conditions: string[] = [];

            if (search) {
                conditions.push('(u.name LIKE ? OR f.employee_id LIKE ? OR u.email LIKE ? OR f.position LIKE ?)');
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam);
            }

            if (departmentId) {
                conditions.push('f.department_id = ?');
                params.push(departmentId);
            }

            if (conditions.length > 0) {
                const whereClause = ` WHERE ${conditions.join(' AND ')}`;
                query += whereClause;
                countQuery += whereClause;
            }

            query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
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
                `SELECT 
                    f.id,
                    f.user_id,
                    f.employee_id,
                    f.department_id,
                    f.position,
                    f.employment_type,
                    f.salary,
                    f.phone,
                    f.address,
                    f.qualifications,
                    f.specializations,
                    f.created_at,
                    f.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    d.name as department_name
                FROM faculty f
                LEFT JOIN users u ON f.user_id = u.id
                LEFT JOIN departments d ON f.department_id = d.id
                WHERE f.id = ?`,
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
                `SELECT 
                    f.id,
                    f.user_id,
                    f.employee_id,
                    f.department_id,
                    f.position,
                    f.employment_type,
                    f.salary,
                    f.phone,
                    f.address,
                    f.qualifications,
                    f.specializations,
                    f.created_at,
                    f.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    d.name as department_name
                FROM faculty f
                LEFT JOIN users u ON f.user_id = u.id
                LEFT JOIN departments d ON f.department_id = d.id
                WHERE f.employee_id = ?`,
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
                `SELECT 
                    f.id,
                    f.user_id,
                    f.employee_id,
                    f.department_id,
                    f.position,
                    f.employment_type,
                    f.salary,
                    f.phone,
                    f.address,
                    f.qualifications,
                    f.specializations,
                    f.created_at,
                    f.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    d.name as department_name
                FROM faculty f
                LEFT JOIN users u ON f.user_id = u.id
                LEFT JOIN departments d ON f.department_id = d.id
                WHERE u.email = ?`,
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
                    user_id, employee_id, department_id, position, employment_type, 
                    salary, phone, address, qualifications, specializations
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    faculty.user_id,
                    faculty.employee_id,
                    faculty.department_id || null,
                    faculty.position || null,
                    faculty.employment_type || 'full_time',
                    faculty.salary || null,
                    faculty.phone || null,
                    faculty.address || null,
                    faculty.qualifications || null,
                    faculty.specializations || null
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
            // Get total faculty count
            const [totalResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM faculty'
            );

            // Get faculty by department with department names (show ALL departments, even with 0 faculty)
            const [departmentResult] = await pool.execute<RowDataPacket[]>(
                `SELECT d.name as department, COUNT(f.id) as count 
                 FROM departments d 
                 LEFT JOIN faculty f ON f.department_id = d.id
                 GROUP BY d.id, d.name
                 ORDER BY count DESC`
            );

            // Get faculty by employment type
            const [employmentResult] = await pool.execute<RowDataPacket[]>(
                `SELECT employment_type, COUNT(*) as count 
                 FROM faculty 
                 GROUP BY employment_type
                 ORDER BY count DESC`
            );

            // Get faculty by position
            const [positionResult] = await pool.execute<RowDataPacket[]>(
                `SELECT position, COUNT(*) as count 
                 FROM faculty 
                 WHERE position IS NOT NULL AND position != ''
                 GROUP BY position
                 ORDER BY count DESC`
            );

            // Calculate average salary
            const [salaryResult] = await pool.execute<RowDataPacket[]>(
                `SELECT AVG(salary) as average_salary 
                 FROM faculty 
                 WHERE salary IS NOT NULL AND salary > 0`
            );

            return {
                total: totalResult[0].total || 0,
                byDepartment: departmentResult.map(row => ({
                    department: row.department || 'Unassigned',
                    count: row.count
                })),
                byEmploymentType: employmentResult.map(row => ({
                    type: row.employment_type || 'Unspecified',
                    count: row.count
                })),
                byPosition: positionResult.map(row => ({
                    position: row.position,
                    count: row.count
                })),
                averageSalary: salaryResult[0]?.average_salary || 0
            };
        } catch (error) {
            console.error('Error getting faculty stats:', error);
            return { 
                total: 0, 
                byDepartment: [], 
                byEmploymentType: [],
                byPosition: [],
                averageSalary: 0
            };
        }
    }
}
