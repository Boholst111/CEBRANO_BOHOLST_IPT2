const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDepartmentsAndCourses() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sfms_db'
        });

        console.log('✅ Connected to MySQL database');

        // First, clear existing departments and courses
        console.log('\n🗑️ Clearing existing departments and courses...');
        await connection.execute('DELETE FROM courses');
        await connection.execute('DELETE FROM departments');
        
        // Reset auto increment
        await connection.execute('ALTER TABLE departments AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE courses AUTO_INCREMENT = 1');

        // Insert correct departments
        console.log('\n🏫 Inserting correct departments...');
        await connection.execute(`
            INSERT INTO departments (id, name, code, description) VALUES 
            (1, 'Computer Studies Program', 'CSP', 'Computer Studies Program'),
            (2, 'Engineering Program', 'ENG', 'Engineering Program'),
            (3, 'Teacher Education Program', 'TEP', 'Teacher Education Program')
        `);

        // Insert correct courses
        console.log('\n📚 Inserting correct courses...');
        await connection.execute(`
            INSERT INTO courses (id, name, code, department_id, credits, description) VALUES 
            -- Computer Studies Program courses
            (1, 'BSIT', 'BSIT', 1, 4, 'Bachelor of Science in Information Technology'),
            (2, 'BSCS', 'BSCS', 1, 4, 'Bachelor of Science in Computer Science'),
            (3, 'BLIS', 'BLIS', 1, 4, 'Bachelor of Library and Information Science'),
            (4, 'BSEMC', 'BSEMC', 1, 4, 'Bachelor of Science in Entertainment and Multimedia Computing'),
            -- Engineering Program courses
            (5, 'BSCE', 'BSCE', 2, 4, 'Bachelor of Science in Civil Engineering'),
            (6, 'BSME', 'BSME', 2, 4, 'Bachelor of Science in Mechanical Engineering'),
            (7, 'BSEE', 'BSEE', 2, 4, 'Bachelor of Science in Electrical Engineering'),
            (8, 'BSIE', 'BSIE', 2, 4, 'Bachelor of Science in Industrial Engineering'),
            (9, 'BSGE', 'BSGE', 2, 4, 'Bachelor of Science in Geodetic Engineering'),
            -- Teacher Education Program courses
            (10, 'BSE Major in English', 'BSE-ENG', 3, 4, 'Bachelor of Secondary Education Major in English'),
            (11, 'BSE Major in Mathematics', 'BSE-MATH', 3, 4, 'Bachelor of Secondary Education Major in Mathematics'),
            (12, 'BSE Major in Biology', 'BSE-BIO', 3, 4, 'Bachelor of Secondary Education Major in Biology'),
            (13, 'BSE Major in Chemistry', 'BSE-CHEM', 3, 4, 'Bachelor of Secondary Education Major in Chemistry')
        `);

        // Verify the data
        console.log('\n✅ Verifying departments:');
        const [departments] = await connection.execute('SELECT * FROM departments ORDER BY id');
        console.table(departments);

        console.log('\n✅ Verifying courses:');
        const [courses] = await connection.execute(`
            SELECT c.id, c.name, c.code, d.name as department_name 
            FROM courses c 
            LEFT JOIN departments d ON c.department_id = d.id 
            ORDER BY c.department_id, c.id
        `);
        console.table(courses);

        await connection.end();
        console.log('\n🎉 Database updated successfully with your correct departments and courses!');

    } catch (error) {
        console.error('❌ Error updating database:', error);
    }
}

fixDepartmentsAndCourses();
