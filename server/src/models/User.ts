import { query } from '../config/mysql-database';

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export class UserModel {
    static async findByUsername(username: string): Promise<User | null> {
        try {
            const results = await query('SELECT * FROM users WHERE email = ?', [username]);
            return Array.isArray(results) && results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const results = await query('SELECT * FROM users WHERE email = ?', [email]);
            return Array.isArray(results) && results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null> {
        try {
            const results = await query('SELECT * FROM users WHERE id = ?', [id]);
            return Array.isArray(results) && results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        try {
            const result = await query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [userData.name, userData.email, userData.password, userData.role]
            );
            
            const newUser = await this.findById(result.insertId);
            if (!newUser) {
                throw new Error('Failed to create user');
            }
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async getAll(): Promise<User[]> {
        try {
            const results = await query('SELECT * FROM users ORDER BY created_at DESC');
            return Array.isArray(results) ? results : [];
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    static async update(id: number, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
        try {
            await query(
                'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), password = COALESCE(?, password), role = COALESCE(?, role) WHERE id = ?',
                [userData.name, userData.email, userData.password, userData.role, id]
            );
            
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const result = await query('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }
}
