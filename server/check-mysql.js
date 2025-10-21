const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sfms_db'
        });

        console.log('✅ Connected to MySQL database');

        // Check users table
        console.log('\n📋 USERS TABLE:');
        const [users] = await connection.execute('SELECT * FROM users');
        console.table(users);

        // Check students table
        console.log('\n🎓 STUDENTS TABLE:');
        const [students] = await connection.execute('SELECT * FROM students');
        console.table(students);

        // Check faculty table
        console.log('\n👨‍🏫 FACULTY TABLE:');
        const [faculty] = await connection.execute('SELECT * FROM faculty');
        console.table(faculty);

        // Check departments table
        console.log('\n🏢 DEPARTMENTS TABLE:');
        const [departments] = await connection.execute('SELECT * FROM departments');
        console.table(departments);

        // Check courses table
        console.log('\n📚 COURSES TABLE:');
        const [courses] = await connection.execute('SELECT * FROM courses');
        console.table(courses);

        // Check students with user names (JOIN query)
        console.log('\n🎓 STUDENTS WITH NAMES (JOIN):');
        const [studentsWithNames] = await connection.execute(`
            SELECT 
                s.id,
                s.student_id,
                u.name as user_name,
                u.email as user_email,
                c.name as course_name,
                d.name as department_name,
                s.academic_year,
                s.phone,
                s.address
            FROM students s
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN departments d ON s.department_id = d.id
            ORDER BY s.id
        `);
        console.table(studentsWithNames);

        // Also check what the API model returns
        console.log('\n🔍 RAW STUDENTS TABLE DATA:');
        const [rawStudents] = await connection.execute('SELECT * FROM students ORDER BY id');
        console.table(rawStudents);

        await connection.end();
    } catch (error) {
        console.error('❌ Database error:', error);
    }
}

checkDatabase();
