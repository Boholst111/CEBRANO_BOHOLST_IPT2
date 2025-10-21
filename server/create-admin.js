const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

async function createAdmin() {
    try {
        // Hash the password "admin123"
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Hashed password for admin123:', hashedPassword);
        
        // Connect to database
        const dbPath = path.join(__dirname, '../database/sfms.db');
        const db = new Database(dbPath);
        
        // Update or insert admin user
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO users (id, username, email, password_hash, role, created_at, updated_at)
            VALUES (1, 'admin', 'admin@sfms.com', ?, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        
        stmt.run(hashedPassword);
        
        console.log('✅ Admin user created/updated successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        
        db.close();
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}

createAdmin();
