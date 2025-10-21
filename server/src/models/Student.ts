import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Student {
    id?: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    enrollment_date: string;
    program?: string;
    year_level?: number;
    status: string;
    gpa?: number;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    created_at?: string;
    updated_at?: string;
}

interface StudentRow extends RowDataPacket, Student {}

export class StudentModel {
    static async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ students: Student[], total: number }> {
        try {
            let query = 'SELECT * FROM students';
            let countQuery = 'SELECT COUNT(*) as total FROM students';
            const params: any[] = [];

            if (search) {
                const searchCondition = ` WHERE first_name LIKE ? OR last_name LIKE ? OR student_id LIKE ? OR email LIKE ? OR program LIKE ?`;
                query += searchCondition;
                countQuery += searchCondition;
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            const offset = (page - 1) * limit;
            
            const [students] = await pool.execute<StudentRow[]>(query, [...params, limit, offset]);
            const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, params);
            const total = countResult[0].total;

            return { students, total };
        } catch (error) {
            console.error('Error finding students:', error);
            return { students: [], total: 0 };
        }
    }

    static async findById(id: number): Promise<Student | undefined> {
        try {
            const [rows] = await pool.execute<StudentRow[]>(
                'SELECT * FROM students WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding student by id:', error);
            return undefined;
        }
    }

    static async findByStudentId(studentId: string): Promise<Student | undefined> {
        try {
            const [rows] = await pool.execute<StudentRow[]>(
                'SELECT * FROM students WHERE student_id = ?',
                [studentId]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding student by student_id:', error);
            return undefined;
        }
    }

    static async findByEmail(email: string): Promise<Student | undefined> {
        try {
            const [rows] = await pool.execute<StudentRow[]>(
                'SELECT * FROM students WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding student by email:', error);
            return undefined;
        }
    }

    static async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student | undefined> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                `INSERT INTO students (
                    student_id, first_name, last_name, email, phone, date_of_birth,
                    gender, address, enrollment_date, program, year_level, status,
                    gpa, emergency_contact_name, emergency_contact_phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    student.student_id,
                    student.first_name,
                    student.last_name,
                    student.email,
                    student.phone,
                    student.date_of_birth,
                    student.gender,
                    student.address,
                    student.enrollment_date,
                    student.program,
                    student.year_level,
                    student.status,
                    student.gpa,
                    student.emergency_contact_name,
                    student.emergency_contact_phone
                ]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Error creating student:', error);
            return undefined;
        }
    }

    static async update(id: number, updates: Partial<Student>): Promise<Student | undefined> {
        try {
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => (updates as any)[field]);
            
            await pool.execute(
                `UPDATE students SET ${setClause} WHERE id = ?`,
                [...values, id]
            );
            
            return this.findById(id);
        } catch (error) {
            console.error('Error updating student:', error);
            return undefined;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                'DELETE FROM students WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting student:', error);
            return false;
        }
    }

    static async getStats(): Promise<any> {
        try {
            const [totalResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM students WHERE status = "active"'
            );
            const [programResult] = await pool.execute<RowDataPacket[]>(
                `SELECT program, COUNT(*) as count 
                 FROM students 
                 WHERE status = "active" 
                 GROUP BY program`
            );
            const [yearResult] = await pool.execute<RowDataPacket[]>(
                `SELECT year_level, COUNT(*) as count 
                 FROM students 
                 WHERE status = "active" 
                 GROUP BY year_level`
            );

            return {
                total: totalResult[0].total,
                byProgram: programResult,
                byYear: yearResult
            };
        } catch (error) {
            console.error('Error getting student stats:', error);
            return { total: 0, byProgram: [], byYear: [] };
        }
    }
}
