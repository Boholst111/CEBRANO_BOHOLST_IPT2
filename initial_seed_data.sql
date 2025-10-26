-- Initial Seed Data for Student Faculty Management System
-- Generated from Laravel seeders
-- Date: October 26, 2025

-- Insert departments
INSERT INTO `departments` (`name`, `code`, `description`, `created_at`, `updated_at`) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Information Technology', NOW(), NOW()),
('Engineering', 'ENG', 'Department of Engineering', NOW(), NOW()),
('Business Administration', 'BUS', 'Department of Business Administration', NOW(), NOW()),
('Education', 'EDU', 'Department of Teacher Education', NOW(), NOW()),
('Science', 'SCI', 'Department of Science', NOW(), NOW());

-- Insert academic years
INSERT INTO `academic_years` (`name`, `start_year`, `end_year`, `is_current`, `created_at`, `updated_at`) VALUES
('2023-2024', 2023, 2024, 0, NOW(), NOW()),
('2024-2025', 2024, 2025, 1, NOW(), NOW()),
('2025-2026', 2025, 2026, 0, NOW(), NOW());

-- Insert courses
INSERT INTO `courses` (`name`, `code`, `department_id`, `credits`, `description`, `created_at`, `updated_at`) VALUES
-- Computer Science courses
('Introduction to Programming', 'CS101', 1, 3, 'Fundamentals of programming using Python', NOW(), NOW()),
('Data Structures', 'CS102', 1, 3, 'Study of arrays, linked lists, stacks, queues, and trees', NOW(), NOW()),
('Web Development', 'CS103', 1, 3, 'HTML, CSS, JavaScript, and modern web frameworks', NOW(), NOW()),
('Database Management', 'CS104', 1, 3, 'SQL, database design, and management systems', NOW(), NOW()),
('Software Engineering', 'CS201', 1, 4, 'Software development lifecycle and best practices', NOW(), NOW()),

-- Engineering courses
('Circuit Analysis', 'ENG101', 2, 4, 'Electrical circuit theory and analysis', NOW(), NOW()),
('Thermodynamics', 'ENG102', 2, 4, 'Laws of thermodynamics and heat transfer', NOW(), NOW()),
('Mechanics of Materials', 'ENG103', 2, 4, 'Stress, strain, and material properties', NOW(), NOW()),
('Structural Analysis', 'ENG201', 2, 4, 'Analysis of beams, frames, and structures', NOW(), NOW()),

-- Business courses
('Principles of Management', 'BUS101', 3, 3, 'Fundamentals of business management', NOW(), NOW()),
('Financial Accounting', 'BUS102', 3, 3, 'Accounting principles and financial statements', NOW(), NOW()),
('Business Economics', 'BUS103', 3, 3, 'Microeconomics and macroeconomics for business', NOW(), NOW()),
('Marketing Strategy', 'BUS201', 3, 3, 'Marketing principles and strategic planning', NOW(), NOW()),

-- Education courses
('Educational Psychology', 'EDU101', 4, 3, 'Psychology of learning and teaching', NOW(), NOW()),
('Curriculum Design', 'EDU102', 4, 3, 'Principles of curriculum development', NOW(), NOW()),
('Teaching Methods', 'EDU103', 4, 3, 'Instructional strategies and classroom management', NOW(), NOW()),

-- Science courses
('General Physics', 'SCI101', 5, 4, 'Mechanics, waves, and thermodynamics', NOW(), NOW()),
('General Chemistry', 'SCI102', 5, 4, 'Atomic structure, bonding, and reactions', NOW(), NOW()),
('General Biology', 'SCI103', 5, 4, 'Cell biology, genetics, and evolution', NOW(), NOW()),
('Organic Chemistry', 'SCI201', 5, 4, 'Organic molecules and reaction mechanisms', NOW(), NOW());

-- Insert admin user
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Admin User', 'admin@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());
-- Password is: password123 (bcrypt hash)

-- Insert faculty users and records
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Professor Smith 1', 'faculty1@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 2', 'faculty2@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 3', 'faculty3@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 4', 'faculty4@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 5', 'faculty5@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 6', 'faculty6@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 7', 'faculty7@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 8', 'faculty8@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 9', 'faculty9@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW()),
('Professor Smith 10', 'faculty10@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', NOW(), NOW());

INSERT INTO `faculty` (`user_id`, `employee_id`, `department_id`, `position`, `employment_type`, `salary`, `phone`, `address`, `qualifications`, `specializations`, `created_at`, `updated_at`) VALUES
(2, 'EMP00001', 1, 'Professor', 'full_time', 85000.00, '555-0001', 'Faculty Address 1, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(3, 'EMP00002', 2, 'Associate Professor', 'full_time', 75000.00, '555-0002', 'Faculty Address 2, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(4, 'EMP00003', 3, 'Assistant Professor', 'part_time', 65000.00, '555-0003', 'Faculty Address 3, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(5, 'EMP00004', 4, 'Professor', 'full_time', 90000.00, '555-0004', 'Faculty Address 4, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(6, 'EMP00005', 5, 'Associate Professor', 'full_time', 78000.00, '555-0005', 'Faculty Address 5, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(7, 'EMP00006', 1, 'Assistant Professor', 'part_time', 62000.00, '555-0006', 'Faculty Address 6, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(8, 'EMP00007', 2, 'Professor', 'full_time', 88000.00, '555-0007', 'Faculty Address 7, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(9, 'EMP00008', 3, 'Associate Professor', 'full_time', 72000.00, '555-0008', 'Faculty Address 8, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(10, 'EMP00009', 4, 'Assistant Professor', 'part_time', 58000.00, '555-0009', 'Faculty Address 9, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW()),
(11, 'EMP00010', 5, 'Professor', 'full_time', 95000.00, '555-0010', 'Faculty Address 10, City', 'PhD, Master\'s Degree', 'Computer Science, Programming', NOW(), NOW());

-- Insert student users and records (first 10 for brevity - you can add more)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Student Name 1', 'student1@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 2', 'student2@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 3', 'student3@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 4', 'student4@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 5', 'student5@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 6', 'student6@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 7', 'student7@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 8', 'student8@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 9', 'student9@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW()),
('Student Name 10', 'student10@sfms.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', NOW(), NOW());

INSERT INTO `students` (`user_id`, `student_id`, `department_id`, `academic_year_id`, `course_id`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(12, 'STU000001', 1, 2, 1, '555-0001', 'Student Address 1, City', NOW(), NOW()),
(13, 'STU000002', 2, 2, 6, '555-0002', 'Student Address 2, City', NOW(), NOW()),
(14, 'STU000003', 3, 2, 11, '555-0003', 'Student Address 3, City', NOW(), NOW()),
(15, 'STU000004', 4, 2, 14, '555-0004', 'Student Address 4, City', NOW(), NOW()),
(16, 'STU000005', 5, 2, 17, '555-0005', 'Student Address 5, City', NOW(), NOW()),
(17, 'STU000006', 1, 2, 2, '555-0006', 'Student Address 6, City', NOW(), NOW()),
(18, 'STU000007', 2, 2, 7, '555-0007', 'Student Address 7, City', NOW(), NOW()),
(19, 'STU000008', 3, 2, 12, '555-0008', 'Student Address 8, City', NOW(), NOW()),
(20, 'STU000009', 4, 2, 15, '555-0009', 'Student Address 9, City', NOW(), NOW()),
(21, 'STU000010', 5, 2, 18, '555-0010', 'Student Address 10, City', NOW(), NOW());

-- Test User Credentials:
-- Admin: admin@sfms.local / password123
-- Faculty: faculty1@sfms.local / password123
-- Student: student1@sfms.local / password123