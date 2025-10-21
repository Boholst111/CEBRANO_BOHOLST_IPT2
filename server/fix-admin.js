const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

async function fixAdmin() {
    try {
        // Connect to database
        const dbPath = path.join(__dirname, '../database/sfms.db');
        const db = new Database(dbPath);
        
        // Check if users table exists
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
        
        if (!tableExists) {
            console.log('❌ Users table does not exist. Creating it...');
            
            // Create users table
            db.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'admin',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            console.log('✅ Users table created');
        }
        
        // Hash the password "admin123"
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Delete existing admin user if any
        db.prepare('DELETE FROM users WHERE username = ?').run('admin');
        
        // Insert new admin user
        const stmt = db.prepare(`
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `);
        
        stmt.run('admin', 'admin@sfms.com', hashedPassword, 'admin');
        
        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Hashed password:', hashedPassword);
        
        // Verify the user was created
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
        console.log('✅ Verification - User found:', user ? 'YES' : 'NO');
        
        db.close();
    } catch (error) {
        console.error('❌ Error fixing admin user:', error);
    }
}

fixAdmin();
