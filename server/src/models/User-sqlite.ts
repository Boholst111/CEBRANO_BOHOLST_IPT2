import db from '../config/sqlite-database';

export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export class UserModel {
    static findByUsername(username: string): User | undefined {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username) as User | undefined;
    }

    static findByEmail(email: string): User | undefined {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as User | undefined;
    }

    static findById(id: number): User | undefined {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) as User | undefined;
    }

    static create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
        const stmt = db.prepare(`
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(user.username, user.email, user.password_hash, user.role);
        
        return this.findById(result.lastInsertRowid as number)!;
    }

    static update(id: number, updates: Partial<User>): User | undefined {
        const fields = Object.keys(updates).filter(key => key !== 'id');
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => (updates as any)[field]);
        
        const stmt = db.prepare(`
            UPDATE users 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `);
        
        stmt.run(...values, id);
        return this.findById(id);
    }

    static delete(id: number): boolean {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}
