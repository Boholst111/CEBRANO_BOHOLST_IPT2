# Database Schema and Seed Data

This directory contains the complete database schema and initial seed data for the Student Faculty Management System (SFMS).

## Files

- `complete_database_schema.sql` - Complete database schema with all tables, indexes, and foreign key constraints
- `initial_seed_data.sql` - Initial seed data including departments, courses, academic years, and sample users

## Database Setup Instructions

### 1. Create Database
```sql
CREATE DATABASE sfms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sfms_db;
```

### 2. Import Schema
```bash
mysql -u your_username -p sfms_db < complete_database_schema.sql
```

### 3. Import Seed Data (Optional)
```bash
mysql -u your_username -p sfms_db < initial_seed_data.sql
```

## Database Structure

### Core Tables

1. **users** - User accounts (admin, faculty, student)
   - id, name, email, password, role, phone, address

2. **departments** - Academic departments
   - id, name, code, description

3. **academic_years** - Academic year definitions
   - id, name, start_year, end_year, is_current

4. **courses** - Course catalog
   - id, name, code, department_id, credits, description

5. **students** - Student records
   - id, user_id, student_id, course_id, department_id, academic_year_id, phone, address

6. **faculty** - Faculty records
   - id, user_id, employee_id, department_id, position, employment_type, salary, phone, address, qualifications, specializations

### Relationships

- Users → Students (1:1)
- Users → Faculty (1:1)
- Departments → Courses (1:many)
- Departments → Students (1:many)
- Departments → Faculty (1:many)
- Academic Years → Students (1:many)
- Courses → Students (1:many, via course_id in students table)

## Test Credentials

After importing seed data, you can log in with:

- **Admin**: admin@sfms.local / password123
- **Faculty**: faculty1@sfms.local / password123
- **Student**: student1@sfms.local / password123

## Notes

- All passwords are hashed using bcrypt
- The schema includes proper foreign key constraints
- Character set is utf8mb4 for full Unicode support
- Timestamps are automatically managed by the application

## Migration Notes

This schema was generated from Laravel migrations. If you're using Laravel, you can run:

```bash
php artisan migrate
php artisan db:seed
```

Instead of manually importing the SQL files.