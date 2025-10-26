const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedMockData() {
    try {
        console.log('🌱 Seeding mock data...\n');
        
        // Connect to database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sfms_db'
        });

        console.log('✅ Connected to database');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await connection.execute('DELETE FROM students');
        // await connection.execute('DELETE FROM faculty');
        // await connection.execute('DELETE FROM users WHERE id > 1');

        // 1. Create mock users for students
        console.log('\n📝 Creating student users...');
        const studentUsers = [
            { name: 'John Smith', email: 'john.smith@student.edu', password: 'hashedpassword123' },
            { name: 'Maria Garcia', email: 'maria.garcia@student.edu', password: 'hashedpassword123' },
            { name: 'Ahmad Hassan', email: 'ahmad.hassan@student.edu', password: 'hashedpassword123' },
            { name: 'Sarah Johnson', email: 'sarah.johnson@student.edu', password: 'hashedpassword123' },
            { name: 'Michael Chen', email: 'michael.chen@student.edu', password: 'hashedpassword123' },
            { name: 'Emma Wilson', email: 'emma.wilson@student.edu', password: 'hashedpassword123' },
            { name: 'David Martinez', email: 'david.martinez@student.edu', password: 'hashedpassword123' },
            { name: 'Jessica Lee', email: 'jessica.lee@student.edu', password: 'hashedpassword123' },
            { name: 'Robert Brown', email: 'robert.brown@student.edu', password: 'hashedpassword123' },
            { name: 'Lisa Anderson', email: 'lisa.anderson@student.edu', password: 'hashedpassword123' }
        ];

        const studentUserIds = [];
        for (const user of studentUsers) {
            const [result] = await connection.execute(
                'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [user.name, user.email, user.password, 'student']
            );
            if (result.insertId) {
                studentUserIds.push(result.insertId);
            }
        }
        console.log(`✅ Created ${studentUserIds.length} student users`);

        // 2. Create mock students
        console.log('\n🎓 Creating students...');
        const courses = [
            { id: 1, name: 'BSIT', department_id: 1 },
            { id: 2, name: 'BSCS', department_id: 1 },
            { id: 3, name: 'BSCE', department_id: 2 },
            { id: 4, name: 'BSME', department_id: 2 },
            { id: 5, name: 'BSE-English', department_id: 3 }
        ];

        let studentCount = 0;
        for (let i = 0; i < studentUserIds.length; i++) {
            const course = courses[i % courses.length];
            const [result] = await connection.execute(
                `INSERT IGNORE INTO students 
                (user_id, student_id, course_id, department_id, academic_year, phone, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentUserIds[i],
                    `STU-2024-${1000 + i}`,
                    course.id,
                    course.department_id,
                    '2024-2025',
                    `+1-555-${1000 + i}`,
                    `${i + 1} Student Street, City ${String.fromCharCode(65 + (i % 3))}, State`
                ]
            );
            if (result.affectedRows > 0) studentCount++;
        }
        console.log(`✅ Created ${studentCount} students`);

        // 3. Create mock users for faculty
        console.log('\n👨‍🏫 Creating faculty users...');
        const facultyUsers = [
            { name: 'Dr. James Wilson', email: 'james.wilson@faculty.edu', password: 'hashedpassword123' },
            { name: 'Dr. Patricia Brown', email: 'patricia.brown@faculty.edu', password: 'hashedpassword123' },
            { name: 'Prof. Michael Davis', email: 'michael.davis@faculty.edu', password: 'hashedpassword123' },
            { name: 'Dr. Susan Miller', email: 'susan.miller@faculty.edu', password: 'hashedpassword123' },
            { name: 'Prof. Christopher Taylor', email: 'christopher.taylor@faculty.edu', password: 'hashedpassword123' },
            { name: 'Dr. Jennifer Garcia', email: 'jennifer.garcia@faculty.edu', password: 'hashedpassword123' }
        ];

        const facultyUserIds = [];
        for (const user of facultyUsers) {
            const [result] = await connection.execute(
                'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [user.name, user.email, user.password, 'faculty']
            );
            if (result.insertId) {
                facultyUserIds.push(result.insertId);
            }
        }
        console.log(`✅ Created ${facultyUserIds.length} faculty users`);

        // 4. Create mock faculty members
        console.log('\n📚 Creating faculty members...');
        const positions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
        const departments = [1, 2, 3];

        let facultyCount = 0;
        for (let i = 0; i < facultyUserIds.length; i++) {
            const [result] = await connection.execute(
                `INSERT IGNORE INTO faculty 
                (user_id, employee_id, department_id, position, employment_type, salary, phone, address, qualifications, specializations) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    facultyUserIds[i],
                    `FAC-${2000 + i}`,
                    departments[i % departments.length],
                    positions[i % positions.length],
                    i % 2 === 0 ? 'full_time' : 'part_time',
                    50000 + (i * 5000),
                    `+1-555-${2000 + i}`,
                    `${100 + i} Faculty Lane, University City, State`,
                    'Ph.D. in Computer Science, M.S. in Software Engineering',
                    'Web Development, Data Science, AI/Machine Learning'
                ]
            );
            if (result.affectedRows > 0) facultyCount++;
        }
        console.log(`✅ Created ${facultyCount} faculty members`);

        // 5. Verify data
        console.log('\n📊 Verifying data...');
        
        const [studentCounts] = await connection.execute(
            'SELECT COUNT(*) as total, COUNT(DISTINCT department_id) as departments FROM students'
        );
        console.log(`📈 Students: ${studentCounts[0].total} total, across ${studentCounts[0].departments} departments`);

        const [facultyCounts] = await connection.execute(
            'SELECT COUNT(*) as total, COUNT(DISTINCT department_id) as departments FROM faculty'
        );
        console.log(`📈 Faculty: ${facultyCounts[0].total} total, across ${facultyCounts[0].departments} departments`);

        const [userCounts] = await connection.execute(
            'SELECT role, COUNT(*) as count FROM users GROUP BY role'
        );
        console.log(`📈 Users by role:`);
        for (const row of userCounts) {
            console.log(`   - ${row.role}: ${row.count}`);
        }

        // 6. Show sample data
        console.log('\n📋 Sample Students:');
        const [sampleStudents] = await connection.execute(
            `SELECT s.*, u.name, u.email, c.name as course_name, d.name as department_name 
             FROM students s 
             JOIN users u ON s.user_id = u.id 
             LEFT JOIN courses c ON s.course_id = c.id 
             LEFT JOIN departments d ON s.department_id = d.id 
             LIMIT 3`
        );
        console.table(sampleStudents);

        console.log('\n📋 Sample Faculty:');
        const [sampleFaculty] = await connection.execute(
            `SELECT f.*, u.name, u.email, d.name as department_name 
             FROM faculty f 
             JOIN users u ON f.user_id = u.id 
             LEFT JOIN departments d ON f.department_id = d.id 
             LIMIT 3`
        );
        console.table(sampleFaculty);

        await connection.end();
        console.log('\n✅ Mock data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding mock data:', error.message);
        process.exit(1);
    }
}

seedMockData();
