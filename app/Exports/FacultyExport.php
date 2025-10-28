<?php

namespace App\Exports;

use App\Models\Faculty;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FacultyExport implements FromArray, WithHeadings
{
    protected $departmentId;

    public function __construct($departmentId = null)
    {
        $this->departmentId = $departmentId;
    }

    /**
     * Get the array of faculty to export
     */
    public function array(): array
    {
        $query = Faculty::with('user', 'department');

        if ($this->departmentId) {
            $query->where('department_id', $this->departmentId);
        }

        $faculty_list = $query->get();
        $data = [];

        foreach ($faculty_list as $faculty) {
            $data[] = [
                $faculty->employee_id ?? 'N/A',
                $faculty->user->name ?? 'N/A',
                $faculty->user->email ?? 'N/A',
                $faculty->department->name ?? 'N/A',
                $faculty->position ?? 'N/A',
                ucfirst(str_replace('_', ' ', $faculty->employment_type ?? 'N/A')),
                $faculty->salary ? '$' . number_format($faculty->salary, 2) : 'N/A',
                $faculty->phone ?? 'N/A',
                $faculty->address ?? 'N/A',
                $faculty->qualifications ?? 'N/A',
                $faculty->specializations ?? 'N/A',
                $faculty->created_at ? $faculty->created_at->format('Y-m-d') : 'N/A',
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
            'Employee ID',
            'Name',
            'Email',
            'Department',
            'Position',
            'Employment Type',
            'Salary',
            'Phone',
            'Address',
            'Qualifications',
            'Specializations',
            'Hired',
        ];
    }

    /**
     * Set column widths
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 20,
            'C' => 25,
            'D' => 20,
            'E' => 20,
            'F' => 18,
            'G' => 15,
            'H' => 15,
            'I' => 30,
            'J' => 30,
            'K' => 30,
            'L' => 15,
        ];
    }
}
