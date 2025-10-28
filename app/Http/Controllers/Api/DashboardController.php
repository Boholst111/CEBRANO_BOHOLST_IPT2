<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index()
    {
        $stats = [
            'total_students' => Student::count(),
            'total_faculty' => Faculty::count(),
            'total_courses' => Course::count(),
            'total_departments' => Department::count(),
            'current_academic_year' => AcademicYear::where('is_current', true)->first(),
            'recent_students' => Student::with('user')->latest()->take(5)->get(),
            'recent_faculty' => Faculty::with('user')->latest()->take(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}