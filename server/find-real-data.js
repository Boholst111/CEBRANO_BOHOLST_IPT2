const mysql = require('mysql2/promise');
require('dotenv').config();

async function findRealData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Connected to MySQL server');

        // List all databases
        console.log('\n📋 ALL DATABASES:');
        const [databases] = await connection.execute('SHOW DATABASES');
        console.table(databases);

        // Check each database for students table with TEST007 or FINAL001
        for (const db of databases) {
            const dbName = db.Database;
            if (dbName === 'information_schema' || dbName === 'performance_schema' || dbName === 'mysql' || dbName === 'sys') {
                continue;
            }

            try {
                await connection.query(`USE ${dbName}`);
                console.log(`\n🔍 Checking database: ${dbName}`);
                
                // Check if students table exists
                const [tables] = await connection.query("SHOW TABLES LIKE 'students'");
                if (tables.length > 0) {
                    console.log(`  ✅ Found students table in ${dbName}`);
                    
                    // Check for specific student IDs from phpMyAdmin
                    const [students] = await connection.execute("SELECT student_id, id FROM students WHERE student_id IN ('TEST007', 'FINAL001') OR student_id LIKE 'TEST%' OR student_id LIKE 'FINAL%'");
                    if (students.length > 0) {
                        console.log(`  🎯 FOUND REAL DATA in ${dbName}:`);
                        console.table(students);
                    }
                    
                    // Show all student IDs in this database
                    const [allStudents] = await connection.execute("SELECT student_id, id FROM students ORDER BY id LIMIT 10");
                    console.log(`  📊 Sample students in ${dbName}:`);
                    console.table(allStudents);
                }
            } catch (error) {
                console.log(`  ❌ Error checking ${dbName}:`, error.message);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Database error:', error);
    }
}

findRealData();
