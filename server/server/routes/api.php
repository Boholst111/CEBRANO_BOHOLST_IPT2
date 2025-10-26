<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Public filter endpoints for dropdowns (no authentication required)
Route::get('/academic-years', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\AcademicYear::all(),
    ]);
});

Route::get('/departments', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Department::all(),
    ]);
});

Route::get('/courses', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Course::with('department')->get(),
    ]);
});

// Protected auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Student routes
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::get('/students/stats', [StudentController::class, 'statistics']);  // Frontend alias
    Route::get('/students/statistics/all', [StudentController::class, 'statistics']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);

    // Faculty routes
    Route::get('/faculty', [FacultyController::class, 'index']);
    Route::post('/faculty', [FacultyController::class, 'store']);
    Route::get('/faculty/stats', [FacultyController::class, 'statistics']);  // Frontend alias
    Route::get('/faculty/statistics/all', [FacultyController::class, 'statistics']);
    Route::get('/faculty/{id}', [FacultyController::class, 'show']);
    Route::put('/faculty/{id}', [FacultyController::class, 'update']);
    Route::delete('/faculty/{id}', [FacultyController::class, 'destroy']);

    // Course routes
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    Route::get('/courses/by-department/{departmentId}', [CourseController::class, 'byDepartment']);
    Route::get('/courses/statistics/all', [CourseController::class, 'statistics']);

    // Department routes
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::get('/departments/all/list', [DepartmentController::class, 'all']);
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    Route::get('/departments/{id}/details', [DepartmentController::class, 'withDetails']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

    // Academic Year routes
    Route::post('/academic-years', [AcademicYearController::class, 'store']);
    Route::get('/academic-years/{academicYear}', [AcademicYearController::class, 'show']);
    Route::put('/academic-years/{academicYear}', [AcademicYearController::class, 'update']);
    Route::delete('/academic-years/{academicYear}/archive', [AcademicYearController::class, 'archive']);
    Route::delete('/academic-years/{academicYear}', [AcademicYearController::class, 'destroy']);

    // Reports routes
    Route::get('/reports/dashboard', [ReportsController::class, 'dashboard']);
    Route::get('/reports/enrollment', [ReportsController::class, 'enrollment']);
    Route::get('/reports/enrollment-by-department', [ReportsController::class, 'enrollmentByDepartment']);
    Route::get('/reports/faculty-distribution', [ReportsController::class, 'facultyDistribution']);
    Route::get('/reports/academic-years', [ReportsController::class, 'academicYears']);
    Route::get('/reports/department/{departmentId}', [ReportsController::class, 'departmentDetails']);
    Route::get('/reports/courses', [ReportsController::class, 'courseStatistics']);
    Route::get('/reports/students-by-year', [ReportsController::class, 'studentsByAcademicYear']);
    Route::get('/reports/health', [ReportsController::class, 'systemHealth']);
    Route::get('/reports/students', [ReportsController::class, 'studentDetails']);
    Route::get('/reports/faculty', [ReportsController::class, 'facultyDetails']);

    // Export routes (Excel)
    Route::get('/export/students/excel', [ReportsController::class, 'exportStudentsExcel']);
    Route::get('/export/faculty/excel', [ReportsController::class, 'exportFacultyExcel']);
    Route::get('/export/enrollment/excel', [ReportsController::class, 'exportEnrollmentExcel']);

    // Export routes (PDF)
    Route::get('/export/students/pdf', [ReportsController::class, 'exportStudentsPDF']);
    Route::get('/export/faculty/pdf', [ReportsController::class, 'exportFacultyPDF']);
    Route::get('/export/enrollment/pdf', [ReportsController::class, 'exportEnrollmentPDF']);
});

// Get current user (alternate route)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
