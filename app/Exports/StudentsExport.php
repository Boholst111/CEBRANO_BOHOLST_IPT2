<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentsExport implements FromArray, WithHeadings
{
    protected $departmentId;
    protected $courseId;

    public function __construct($departmentId = null, $courseId = null)
    {
        $this->departmentId = $departmentId;
        $this->courseId = $courseId;
    }

    /**
     * Get the array of students to export
     */
    public function array(): array
    {
        $query = Student::with('user', 'course', 'department');

        if ($this->departmentId) {
            $query->where('department_id', $this->departmentId);
        }

        if ($this->courseId) {
            $query->where('course_id', $this->courseId);
        }

        $students = $query->get();
        $data = [];

        foreach ($students as $student) {
            $data[] = [
                $student->student_id ?? 'N/A',
                $student->user->name ?? 'N/A',
                $student->user->email ?? 'N/A',
                $student->department->name ?? 'N/A',
                $student->course->name ?? 'N/A',
                $student->course->code ?? 'N/A',
                $student->academic_year ?? 'N/A',
                $student->phone ?? 'N/A',
                $student->address ?? 'N/A',
                $student->created_at ? $student->created_at->format('Y-m-d') : 'N/A',
            ];
        }

        return $data;
    }

    /**
     * Define the headings for the Excel sheet
     */
    public function headings(): array
    {
        return [
            'Student ID',
            'Name',
            'Email',
            'Department',
            'Course',
            'Course Code',
            'Academic Year',
            'Phone',
            'Address',
            'Enrolled',
        ];
    }
}
