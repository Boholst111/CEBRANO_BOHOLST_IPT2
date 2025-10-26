import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(__dirname, '../../database');
const dbFile = path.join(dbPath, 'sfms.db');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize database
const db: Database.Database = new Database(dbFile);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing SQLite database...');
        
        // Create tables
        createTables();
        
        // Insert default data
        await insertDefaultData();
        
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
};

const createTables = () => {
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Students table
    db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id VARCHAR(20) UNIQUE NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20),
            date_of_birth DATE,
            gender VARCHAR(10),
            address TEXT,
            enrollment_date DATE NOT NULL,
            program VARCHAR(100),
            year_level INTEGER,
            status VARCHAR(20) DEFAULT 'active',
            gpa DECIMAL(3,2),
            emergency_contact_name VARCHAR(100),
            emergency_contact_phone VARCHAR(20),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Faculty table
    db.exec(`
        CREATE TABLE IF NOT EXISTS faculty (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id VARCHAR(20) UNIQUE NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20),
            date_of_birth DATE,
            gender VARCHAR(10),
            address TEXT,
            hire_date DATE NOT NULL,
            department VARCHAR(100),
            position VARCHAR(100),
            salary DECIMAL(10,2),
            status VARCHAR(20) DEFAULT 'active',
            qualifications TEXT,
            specialization VARCHAR(200),
            office_location VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Courses table
    db.exec(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_code VARCHAR(20) UNIQUE NOT NULL,
            course_name VARCHAR(200) NOT NULL,
            description TEXT,
            credits INTEGER,
            department VARCHAR(100),
            faculty_id INTEGER,
            semester VARCHAR(20),
            academic_year VARCHAR(10),
            status VARCHAR(20) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (faculty_id) REFERENCES faculty(id)
        )
    `);

    // Enrollments table
    db.exec(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            enrollment_date DATE NOT NULL,
            grade VARCHAR(5),
            status VARCHAR(20) DEFAULT 'enrolled',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (course_id) REFERENCES courses(id),
            UNIQUE(student_id, course_id)
        )
    `);

    console.log('✅ Tables created successfully');
};

const insertDefaultData = async () => {
    try {
        // Check if admin user exists
        const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

        if (!adminExists) {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.prepare(`
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `).run('admin', 'admin@sfms.com', hashedPassword, 'admin');
            console.log('✅ Default admin user created');
        }

        // Insert sample students
        const studentExists = db.prepare('SELECT id FROM students LIMIT 1').get();
        if (!studentExists) {
            const insertStudent = db.prepare(`
                INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, address, enrollment_date, program, year_level, gpa)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insertStudent.run('STU001', 'John', 'Doe', 'john.doe@student.edu', '123-456-7890', '2000-05-15', 'Male', '123 Main St, City, State', '2023-08-15', 'Computer Science', 2, 3.75);
            insertStudent.run('STU002', 'Jane', 'Smith', 'jane.smith@student.edu', '123-456-7891', '2001-03-22', 'Female', '456 Oak Ave, City, State', '2023-08-15', 'Information Technology', 2, 3.85);
            insertStudent.run('STU003', 'Mike', 'Johnson', 'mike.johnson@student.edu', '123-456-7892', '1999-11-08', 'Male', '789 Pine St, City, State', '2022-08-15', 'Computer Science', 3, 3.60);
            
            console.log('✅ Sample students inserted');
        }

        // Insert sample faculty
        const facultyExists = db.prepare('SELECT id FROM faculty LIMIT 1').get();
        if (!facultyExists) {
            const insertFaculty = db.prepare(`
                INSERT INTO faculty (employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, hire_date, department, position, salary, qualifications, specialization, office_location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insertFaculty.run('FAC001', 'Dr. Sarah', 'Wilson', 'sarah.wilson@university.edu', '555-123-4567', '1975-08-20', 'Female', '321 University Ave, City, State', '2015-08-15', 'Computer Science', 'Professor', 85000.00, 'PhD in Computer Science', 'Artificial Intelligence, Machine Learning', 'CS Building, Room 301');
            insertFaculty.run('FAC002', 'Prof. David', 'Brown', 'david.brown@university.edu', '555-123-4568', '1970-12-10', 'Male', '654 Faculty Dr, City, State', '2010-08-15', 'Information Technology', 'Associate Professor', 75000.00, 'PhD in Information Systems', 'Database Systems, Web Development', 'IT Building, Room 205');
            insertFaculty.run('FAC003', 'Dr. Lisa', 'Garcia', 'lisa.garcia@university.edu', '555-123-4569', '1980-04-03', 'Female', '987 Academic Ln, City, State', '2018-08-15', 'Computer Science', 'Assistant Professor', 65000.00, 'PhD in Software Engineering', 'Software Architecture, Mobile Development', 'CS Building, Room 402');
            
            console.log('✅ Sample faculty inserted');
        }

    } catch (error) {
        console.error('❌ Error inserting default data:', error);
    }
};

export default db;
