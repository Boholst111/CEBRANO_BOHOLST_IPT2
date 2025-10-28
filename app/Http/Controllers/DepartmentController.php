<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Get all departments with pagination and filters
     */
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $search = $request->query('search');

        $query = Department::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $total = $query->count();
        $departments = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $departments->items(),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit),
            ],
        ]);
    }

    /**
     * Get single department
     */
    public function show($id)
    {
        $department = Department::with('courses', 'students', 'faculty')->find($id);

        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        return response()->json(['department' => $department]);
    }

    /**
     * Create new department
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:departments|max:10',
            'description' => 'sometimes|string',
        ]);

        $department = Department::create($validated);

        return response()->json(['department' => $department], 201);
    }

    /**
     * Update department
     */
    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:departments,code,' . $id . '|max:10',
            'description' => 'sometimes|string',
        ]);

        $department->update($validated);

        return response()->json(['department' => $department]);
    }

    /**
     * Delete department
     */
    public function destroy($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }

    /**
     * Get all departments (no pagination)
     */
    public function all()
    {
        $departments = Department::all();
        return response()->json(['departments' => $departments]);
    }

    /**
     * Get department with related data
     */
    public function withDetails($id)
    {
        $department = Department::with([
            'courses' => function ($q) {
                $q->withCount('students');
            },
            'students',
            'faculty',
        ])->find($id);

        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        return response()->json([
            'department' => $department,
            'summary' => [
                'total_courses' => $department->courses->count(),
                'total_students' => $department->students->count(),
                'total_faculty' => $department->faculty->count(),
            ],
        ]);
    }
}
