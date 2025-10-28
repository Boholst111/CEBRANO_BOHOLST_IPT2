<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\AcademicYear;
use App\Models\Course;

class CoursesAcademicYearsDepartmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Don't truncate - just add new data if it doesn't exist

        // Create Departments
        $departments = [
            [
                'name' => 'Computer Science',
                'code' => 'CS',
                'description' => 'Department of Computer Science and Information Technology',
            ],
            [
                'name' => 'Engineering',
                'code' => 'ENG',
                'description' => 'Department of Engineering',
            ],
            [
                'name' => 'Business Administration',
                'code' => 'BUS',
                'description' => 'Department of Business Administration',
            ],
            [
                'name' => 'Education',
                'code' => 'EDU',
                'description' => 'Department of Teacher Education',
            ],
            [
                'name' => 'Science',
                'code' => 'SCI',
                'description' => 'Department of Science',
            ],
        ];

        $deptMap = [];
        foreach ($departments as $dept) {
            // Only create if doesn't exist
            $existing = Department::where('code', $dept['code'])->first();
            if (!$existing) {
                $created = Department::create($dept);
                $deptMap[$dept['code']] = $created->id;
            } else {
                $deptMap[$dept['code']] = $existing->id;
            }
        }

        // Create Academic Years
        $academicYears = [
            [
                'name' => '2023-2024',
                'start_year' => 2023,
                'end_year' => 2024,
                'is_current' => false,
            ],
            [
                'name' => '2024-2025',
                'start_year' => 2024,
                'end_year' => 2025,
                'is_current' => true,
            ],
            [
                'name' => '2025-2026',
                'start_year' => 2025,
                'end_year' => 2026,
                'is_current' => false,
            ],
        ];

        foreach ($academicYears as $year) {
            // Only create if doesn't exist
            $existing = AcademicYear::where('name', $year['name'])->first();
            if (!$existing) {
                AcademicYear::create($year);
            }
        }

        // Create Courses
        $courses = [
            // Computer Science
            [
                'name' => 'Introduction to Programming',
                'code' => 'CS101',
                'description' => 'Fundamentals of programming using Python',
                'credits' => 3,
                'department_id' => $deptMap['CS'],
            ],
            [
                'name' => 'Data Structures',
                'code' => 'CS102',
                'description' => 'Study of arrays, linked lists, stacks, queues, and trees',
                'credits' => 3,
                'department_id' => $deptMap['CS'],
            ],
            [
                'name' => 'Web Development',
                'code' => 'CS103',
                'description' => 'HTML, CSS, JavaScript, and modern web frameworks',
                'credits' => 3,
                'department_id' => $deptMap['CS'],
            ],
            [
                'name' => 'Database Management',
                'code' => 'CS104',
                'description' => 'SQL, database design, and management systems',
                'credits' => 3,
                'department_id' => $deptMap['CS'],
            ],
            [
                'name' => 'Software Engineering',
                'code' => 'CS201',
                'description' => 'Software development lifecycle and best practices',
                'credits' => 4,
                'department_id' => $deptMap['CS'],
            ],
            // Engineering
            [
                'name' => 'Circuit Analysis',
                'code' => 'ENG101',
                'description' => 'Electrical circuit theory and analysis',
                'credits' => 4,
                'department_id' => $deptMap['ENG'],
            ],
            [
                'name' => 'Thermodynamics',
                'code' => 'ENG102',
                'description' => 'Laws of thermodynamics and heat transfer',
                'credits' => 4,
                'department_id' => $deptMap['ENG'],
            ],
            [
                'name' => 'Mechanics of Materials',
                'code' => 'ENG103',
                'description' => 'Stress, strain, and material properties',
                'credits' => 4,
                'department_id' => $deptMap['ENG'],
            ],
            [
                'name' => 'Structural Analysis',
                'code' => 'ENG201',
                'description' => 'Analysis of beams, frames, and structures',
                'credits' => 4,
                'department_id' => $deptMap['ENG'],
            ],
            // Business Administration
            [
                'name' => 'Principles of Management',
                'code' => 'BUS101',
                'description' => 'Fundamentals of business management',
                'credits' => 3,
                'department_id' => $deptMap['BUS'],
            ],
            [
                'name' => 'Financial Accounting',
                'code' => 'BUS102',
                'description' => 'Accounting principles and financial statements',
                'credits' => 3,
                'department_id' => $deptMap['BUS'],
            ],
            [
                'name' => 'Business Economics',
                'code' => 'BUS103',
                'description' => 'Microeconomics and macroeconomics for business',
                'credits' => 3,
                'department_id' => $deptMap['BUS'],
            ],
            [
                'name' => 'Marketing Strategy',
                'code' => 'BUS201',
                'description' => 'Marketing principles and strategic planning',
                'credits' => 3,
                'department_id' => $deptMap['BUS'],
            ],
            // Education
            [
                'name' => 'Educational Psychology',
                'code' => 'EDU101',
                'description' => 'Psychology of learning and teaching',
                'credits' => 3,
                'department_id' => $deptMap['EDU'],
            ],
            [
                'name' => 'Curriculum Design',
                'code' => 'EDU102',
                'description' => 'Principles of curriculum development',
                'credits' => 3,
                'department_id' => $deptMap['EDU'],
            ],
            [
                'name' => 'Teaching Methods',
                'code' => 'EDU103',
                'description' => 'Instructional strategies and classroom management',
                'credits' => 3,
                'department_id' => $deptMap['EDU'],
            ],
            // Science
            [
                'name' => 'General Physics',
                'code' => 'SCI101',
                'description' => 'Mechanics, waves, and thermodynamics',
                'credits' => 4,
                'department_id' => $deptMap['SCI'],
            ],
            [
                'name' => 'General Chemistry',
                'code' => 'SCI102',
                'description' => 'Atomic structure, bonding, and reactions',
                'credits' => 4,
                'department_id' => $deptMap['SCI'],
            ],
            [
                'name' => 'General Biology',
                'code' => 'SCI103',
                'description' => 'Cell biology, genetics, and evolution',
                'credits' => 4,
                'department_id' => $deptMap['SCI'],
            ],
            [
                'name' => 'Organic Chemistry',
                'code' => 'SCI201',
                'description' => 'Organic molecules and reaction mechanisms',
                'credits' => 4,
                'department_id' => $deptMap['SCI'],
            ],
        ];

        foreach ($courses as $course) {
            // Only create if doesn't exist
            $existing = Course::where('code', $course['code'])->first();
            if (!$existing) {
                Course::create($course);
            }
        }

        $this->command->info('Successfully seeded courses, academic years, and departments!');
        $this->command->info('Departments created: ' . count($departments));
        $this->command->info('Academic years created: ' . count($academicYears));
        $this->command->info('Courses created: ' . count($courses));
    }
}
