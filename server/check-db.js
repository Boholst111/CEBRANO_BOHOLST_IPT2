const Database = require('better-sqlite3');
const path = require('path');

// Check both possible database locations
const dbPath1 = path.join(__dirname, '../database/sfms.db');
const dbPath2 = path.join(__dirname, 'database/sfms.db');

console.log('Checking database locations:');
console.log('Path 1:', dbPath1);
console.log('Path 2:', dbPath2);

try {
    console.log('\n--- Checking Path 1 ---');
    const db1 = new Database(dbPath1);
    const user1 = db1.prepare('SELECT * FROM users WHERE username = ?').get('admin');
    console.log('User found:', user1 ? 'YES' : 'NO');
    if (user1) {
        console.log('Password hash:', user1.password_hash);
    }
    db1.close();
} catch (error) {
    console.log('Error with Path 1:', error.message);
}

try {
    console.log('\n--- Checking Path 2 ---');
    const db2 = new Database(dbPath2);
    const user2 = db2.prepare('SELECT * FROM users WHERE username = ?').get('admin');
    console.log('User found:', user2 ? 'YES' : 'NO');
    if (user2) {
        console.log('Password hash:', user2.password_hash);
    }
    db2.close();
} catch (error) {
    console.log('Error with Path 2:', error.message);
}
