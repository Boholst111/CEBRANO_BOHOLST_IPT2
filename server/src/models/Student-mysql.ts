import { pool } from '../config/mysql-database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Student {
    id?: number;
    user_id: number;
    student_id: string;
    course_id?: number;
    department_id?: number;
    academic_year?: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    // Joined fields from other tables
    user_name?: string;
    user_email?: string;
    course_name?: string;
    department_name?: string;
}

interface StudentRow extends RowDataPacket, Student {}

export class StudentModel {
    static async findAll(page: number = 1, limit: number = 10, search?: string, departmentId?: number, courseId?: number): Promise<{ students: Student[], total: number }> {
        try {
            let query = `
                SELECT 
                    s.id,
                    s.user_id,
                    s.student_id,
                    s.course_id,
                    s.department_id,
                    s.academic_year,
                    s.phone,
                    s.address,
                    s.created_at,
                    s.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    c.name as course_name,
                    c.code as course_code,
                    d.name as department_name
                FROM students s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN courses c ON s.course_id = c.id
                LEFT JOIN departments d ON s.department_id = d.id
            `;
            
            let countQuery = 'SELECT COUNT(*) as total FROM students s LEFT JOIN users u ON s.user_id = u.id LEFT JOIN courses c ON s.course_id = c.id LEFT JOIN departments d ON s.department_id = d.id';
            const params: any[] = [];
            const conditions: string[] = [];

            if (search) {
                conditions.push('(u.name LIKE ? OR s.student_id LIKE ? OR u.email LIKE ? OR s.academic_year LIKE ?)');
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam, searchParam);
            }

            if (departmentId) {
                conditions.push('s.department_id = ?');
                params.push(departmentId);
            }

            if (courseId) {
                conditions.push('s.course_id = ?');
                params.push(courseId);
            }

            if (conditions.length > 0) {
                const whereClause = ` WHERE ${conditions.join(' AND ')}`;
                query += whereClause;
                countQuery += whereClause;
            }

            query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
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
                `SELECT 
                    s.id,
                    s.user_id,
                    s.student_id,
                    s.course_id,
                    s.department_id,
                    s.academic_year,
                    s.phone,
                    s.address,
                    s.created_at,
                    s.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    c.name as course_name,
                    d.name as department_name
                FROM students s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN courses c ON s.course_id = c.id
                LEFT JOIN departments d ON s.department_id = d.id
                WHERE s.id = ?`,
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
                `SELECT 
                    s.id,
                    s.user_id,
                    s.student_id,
                    s.course_id,
                    s.department_id,
                    s.academic_year,
                    s.phone,
                    s.address,
                    s.created_at,
                    s.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    c.name as course_name,
                    d.name as department_name
                FROM students s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN courses c ON s.course_id = c.id
                LEFT JOIN departments d ON s.department_id = d.id
                WHERE s.student_id = ?`,
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
                `SELECT 
                    s.id,
                    s.user_id,
                    s.student_id,
                    s.course_id,
                    s.department_id,
                    s.academic_year,
                    s.phone,
                    s.address,
                    s.created_at,
                    s.updated_at,
                    u.name as user_name,
                    u.email as user_email,
                    c.name as course_name,
                    d.name as department_name
                FROM students s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN courses c ON s.course_id = c.id
                LEFT JOIN departments d ON s.department_id = d.id
                WHERE u.email = ?`,
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
                    user_id, student_id, course_id, department_id, academic_year, phone, address
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    student.user_id,
                    student.student_id,
                    student.course_id || null,
                    student.department_id || null,
                    student.academic_year || null,
                    student.phone || null,
                    student.address || null
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
            const allowedFields = ['user_id', 'student_id', 'course_id', 'department_id', 'academic_year', 'phone', 'address'];
            const fields = Object.keys(updates).filter(key => key !== 'id' && allowedFields.includes(key));
            
            if (fields.length === 0) {
                return this.findById(id);
            }
            
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
            // Get total students count
            const [totalResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM students'
            );

            // Get students by course with course names (show ALL courses, even with 0 students)
            const [courseResult] = await pool.execute<RowDataPacket[]>(
                `SELECT c.name as course, COUNT(s.id) as count 
                 FROM courses c 
                 LEFT JOIN students s ON s.course_id = c.id
                 GROUP BY c.id, c.name
                 ORDER BY count DESC`
            );

            // Get students by department with department names (show ALL departments, even with 0 students)
            const [departmentResult] = await pool.execute<RowDataPacket[]>(
                `SELECT d.name as department, COUNT(s.id) as count 
                 FROM departments d 
                 LEFT JOIN students s ON s.department_id = d.id
                 GROUP BY d.id, d.name
                 ORDER BY count DESC`
            );

            // Get students by academic year
            const [yearResult] = await pool.execute<RowDataPacket[]>(
                `SELECT academic_year, COUNT(*) as count 
                 FROM students 
                 GROUP BY academic_year
                 ORDER BY academic_year DESC`
            );

            return {
                total: totalResult[0].total || 0,
                byCourse: courseResult.map(row => ({
                    course: row.course || 'Unassigned',
                    count: row.count
                })),
                byDepartment: departmentResult.map(row => ({
                    department: row.department || 'Unassigned', 
                    count: row.count
                })),
                byYear: yearResult.map(row => ({
                    year: row.academic_year || 'Unspecified',
                    count: row.count
                }))
            };
        } catch (error) {
            console.error('Error getting student stats:', error);
            return { 
                total: 0, 
                byCourse: [], 
                byDepartment: [],
                byYear: [] 
            };
        }
    }
}
