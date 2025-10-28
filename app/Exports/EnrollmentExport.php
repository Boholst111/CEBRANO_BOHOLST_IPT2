<?php

namespace App\Exports;

use App\Models\Course;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EnrollmentExport implements FromArray, WithHeadings
{
    /**
     * Get the array of enrollment data to export
     */
    public function array(): array
    {
        $courses = Course::with('students', 'department')->get();
        $data = [];

        foreach ($courses as $course) {
            $data[] = [
                $course->code ?? 'N/A',
                $course->name ?? 'N/A',
                $course->department->name ?? 'N/A',
                $course->credits ?? 'N/A',
                $course->students->count() ?? 0,
                $course->description ?? 'N/A',
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
            'Course Code',
            'Course Name',
            'Department',
            'Credits',
            'Enrolled Students',
            'Description',
        ];
    }
}
