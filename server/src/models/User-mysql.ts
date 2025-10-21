import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

interface UserRow extends RowDataPacket, User {}

export class UserModel {
    static async findByUsername(username: string): Promise<User | undefined> {
        try {
            const [rows] = await pool.execute<UserRow[]>(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding user by username:', error);
            return undefined;
        }
    }

    static async findByEmail(email: string): Promise<User | undefined> {
        try {
            const [rows] = await pool.execute<UserRow[]>(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            return undefined;
        }
    }

    static async findById(id: number): Promise<User | undefined> {
        try {
            const [rows] = await pool.execute<UserRow[]>(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding user by id:', error);
            return undefined;
        }
    }

    static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | undefined> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [user.username, user.email, user.password_hash, user.role]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Error creating user:', error);
            return undefined;
        }
    }

    static async update(id: number, updates: Partial<User>): Promise<User | undefined> {
        try {
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => (updates as any)[field]);
            
            await pool.execute(
                `UPDATE users SET ${setClause} WHERE id = ?`,
                [...values, id]
            );
            
            return this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            return undefined;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }
}
