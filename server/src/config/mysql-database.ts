import * as mysql from 'mysql2/promise';

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sfms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Query function using mysql2/promise
const query = async (sql: string, values?: any[]): Promise<any> => {
    const [results] = await pool.execute(sql, values);
    return results;
};

// Database initialization function
export const initializeDatabase = async (): Promise<void> => {
    try {
        console.log(' Initializing MySQL database...');

        // Create database if it doesn't exist
        const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sfms_db'}`;
        await query(createDbQuery);

        // Use the database - using query method instead of execute for USE command
        await pool.query(`USE ${process.env.DB_NAME || 'sfms_db'}`);

        // Create tables if they don't exist (preserve existing data)

        // Create users table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'faculty', 'student') NOT NULL DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create departments table
        await query(`
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(10) UNIQUE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create courses table
        await query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(20) UNIQUE NOT NULL,
                department_id INT,
                credits INT DEFAULT 3,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Create academic_years table
        await query(`
            CREATE TABLE IF NOT EXISTS academic_years (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                start_year INT NOT NULL,
                end_year INT NOT NULL,
                is_current BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create students table
        await query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                student_id VARCHAR(20) UNIQUE NOT NULL,
                course_id INT,
                department_id INT,
                academic_year VARCHAR(20),
                phone VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
                FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Create faculty table
        await query(`
            CREATE TABLE IF NOT EXISTS faculty (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                employee_id VARCHAR(20) UNIQUE NOT NULL,
                department_id INT,
                position VARCHAR(100),
                employment_type ENUM('full_time', 'part_time', 'contract') DEFAULT 'full_time',
                salary DECIMAL(10,2),
                phone VARCHAR(20),
                address TEXT,
                qualifications TEXT,
                specializations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Insert default admin user if not exists
        const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
        if (Array.isArray(adminExists) && adminExists.length === 0) {
            await query(`
                INSERT INTO users (name, email, password, role) 
                VALUES (?, ?, ?, ?)
            `, ['Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin']);
        }

        // Insert default departments if not exists
        const deptExists = await query('SELECT id FROM departments LIMIT 1');
        if (Array.isArray(deptExists) && deptExists.length === 0) {
            await query(`
                INSERT INTO departments (name, code, description) VALUES 
                ('Computer Science', 'CS', 'Department of Computer Science'),
                ('Mathematics', 'MATH', 'Department of Mathematics'),
                ('Physics', 'PHYS', 'Department of Physics'),
                ('Chemistry', 'CHEM', 'Department of Chemistry')
            `);
        }

        // Insert sample courses if not exists
        const courseExists = await query('SELECT id FROM courses LIMIT 1');
        if (Array.isArray(courseExists) && courseExists.length === 0) {
            await query(`
                INSERT INTO courses (name, code, department_id, credits, description) VALUES 
                ('Introduction to Programming', 'CS101', 1, 3, 'Basic programming concepts'),
                ('Data Structures', 'CS201', 1, 4, 'Advanced data structures and algorithms'),
                ('Calculus I', 'MATH101', 2, 4, 'Differential calculus'),
                ('Linear Algebra', 'MATH201', 2, 3, 'Vector spaces and matrices'),
                ('General Physics', 'PHYS101', 3, 4, 'Mechanics and thermodynamics')
            `);
        }

        // DISABLED: Don't insert sample data to preserve existing real data
        // The database already has real student and faculty data
        console.log('✅ Preserving existing student and faculty data');

        console.log('✅ Tables created successfully');
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

// Export the query function for use in other modules
export { query };

// Export pool for advanced usage
export { pool };
