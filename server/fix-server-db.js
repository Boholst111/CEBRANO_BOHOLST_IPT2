const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

async function fixServerDB() {
    try {
        // Use the server's database path
        const dbPath = path.join(__dirname, 'database/sfms.db');
        console.log('Fixing database at:', dbPath);
        
        const db = new Database(dbPath);
        
        // Hash the password "admin123"
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update the admin user's password
        const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
        const result = stmt.run(hashedPassword, 'admin');
        
        console.log('✅ Updated', result.changes, 'user(s)');
        console.log('New password hash:', hashedPassword);
        
        // Verify the update
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
        console.log('✅ Verification - User found:', user ? 'YES' : 'NO');
        
        if (user) {
            const isValid = await bcrypt.compare('admin123', user.password_hash);
            console.log('✅ Password test:', isValid ? 'WORKS' : 'FAILED');
        }
        
        db.close();
        console.log('✅ Database updated successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

fixServerDB();
