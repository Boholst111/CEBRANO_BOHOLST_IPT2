const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

async function testLogin() {
    try {
        // Connect to database
        const dbPath = path.join(__dirname, '../database/sfms.db');
        const db = new Database(dbPath);
        
        // Get the admin user
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
        
        if (!user) {
            console.log('❌ Admin user not found in database');
            return;
        }
        
        console.log('✅ Admin user found:');
        console.log('- Username:', user.username);
        console.log('- Email:', user.email);
        console.log('- Role:', user.role);
        console.log('- Password hash:', user.password_hash);
        
        // Test password verification
        const testPassword = 'admin123';
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        
        console.log('\n🔐 Password test:');
        console.log('- Testing password:', testPassword);
        console.log('- Password valid:', isValid ? '✅ YES' : '❌ NO');
        
        if (!isValid) {
            console.log('\n🔧 Creating new admin user with correct password...');
            
            // Create new hash
            const newHash = await bcrypt.hash('admin123', 10);
            
            // Update user
            const updateStmt = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
            updateStmt.run(newHash, 'admin');
            
            console.log('✅ Admin password updated successfully!');
            console.log('New hash:', newHash);
            
            // Verify again
            const updatedUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
            const isValidNow = await bcrypt.compare('admin123', updatedUser.password_hash);
            console.log('✅ Verification:', isValidNow ? 'Password now works!' : 'Still not working');
        }
        
        db.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testLogin();
