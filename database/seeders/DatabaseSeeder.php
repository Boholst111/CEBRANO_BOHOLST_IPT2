<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Student;
use App\Models\Faculty;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed if no data exists
        if (User::where('role', 'faculty')->exists()) {
            $this->command->info('Faculty already exist. Skipping faculty seeding.');
            return;
        }

        // Create departments
        $departments = [];
        $deptNames = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Sciences'];
        
        foreach ($deptNames as $name) {
            $departments[] = Department::create([
                'name' => $name,
                'code' => strtoupper(substr(str_replace(' ', '', $name), 0, 3)),
                'description' => "Department of {$name}",
            ]);
        }

        // Create academic years
        $years = [];
        for ($i = 2023; $i <= 2025; $i++) {
            $years[] = AcademicYear::create([
                'name' => "{$i}-" . ($i + 1),
                'start_year' => $i,
                'end_year' => $i + 1,
                'is_current' => ($i == 2024),
            ]);
        }

        // Create courses
        $courses = [];
        $courseData = [
            ['name' => 'Introduction to Programming', 'code' => 'CS101', 'credits' => 3],
            ['name' => 'Data Structures', 'code' => 'CS201', 'credits' => 4],
            ['name' => 'Web Development', 'code' => 'CS301', 'credits' => 3],
            ['name' => 'Database Systems', 'code' => 'CS302', 'credits' => 4],
            ['name' => 'Software Engineering', 'code' => 'CS401', 'credits' => 4],
            ['name' => 'Advanced Mathematics', 'code' => 'MA201', 'credits' => 4],
            ['name' => 'Physics 1', 'code' => 'PH101', 'credits' => 4],
            ['name' => 'Chemistry 1', 'code' => 'CH101', 'credits' => 3],
            ['name' => 'Business Management', 'code' => 'BZ101', 'credits' => 3],
            ['name' => 'Economics', 'code' => 'EC101', 'credits' => 3],
        ];

        foreach ($courseData as $data) {
            $courses[] = Course::create(array_merge($data, [
                'department_id' => $departments[rand(0, count($departments) - 1)]->id,
                'description' => "This is a course on {$data['name']}",
            ]));
        }

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@sfms.local',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Create faculty members
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "Professor Smith {$i}",
                'email' => "faculty{$i}@sfms.local",
                'password' => bcrypt('password123'),
                'role' => 'faculty',
            ]);

            Faculty::create([
                'user_id' => $user->id,
                'employee_id' => "EMP" . str_pad($i, 5, '0', STR_PAD_LEFT),
                'department_id' => $departments[rand(0, count($departments) - 1)]->id,
                'position' => ['Assistant Professor', 'Associate Professor', 'Professor'][rand(0, 2)],
                'employment_type' => ['full_time', 'part_time'][rand(0, 1)],
                'salary' => rand(50000, 120000),
                'phone' => '555-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'address' => "Faculty Address {$i}, City",
                'qualifications' => 'PhD, Master\'s Degree',
                'specializations' => 'Computer Science, Programming',
            ]);
        }

        // Create students
        for ($i = 1; $i <= 50; $i++) {
            $user = User::create([
                'name' => "Student Name {$i}",
                'email' => "student{$i}@sfms.local",
                'password' => bcrypt('password123'),
                'role' => 'student',
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'student_id' => "STU" . str_pad($i, 6, '0', STR_PAD_LEFT),
                'department_id' => $departments[rand(0, count($departments) - 1)]->id,
                'academic_year_id' => $years[rand(0, count($years) - 1)]->id,
                'course_id' => $courses[rand(0, count($courses) - 1)]->id,
                'phone' => '555-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'address' => "Student Address {$i}, City",
                'date_of_birth' => date('Y-m-d', strtotime("-" . (18 + rand(0, 10)) . " years")),
                'academic_year' => 2024,
            ]);

            // Enroll student in random courses
            $randomCourses = collect($courses)->random(rand(2, 4))->pluck('id');
            $student->courses()->attach($randomCourses);
        }

        $this->command->info('Database seeded successfully with test data!');
        $this->command->info('Test Users:');
        $this->command->info('  Admin: admin@sfms.local / password123');
        $this->command->info('  Faculty: faculty1@sfms.local / password123');
        $this->command->info('  Student: student1@sfms.local / password123');
    }
}
