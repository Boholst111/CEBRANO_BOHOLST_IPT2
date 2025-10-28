<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get settings data
     */
    public function index()
    {
        $settings = [
            'departments' => Department::all(),
            'academic_years' => AcademicYear::all(),
        ];

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Get archived data
     */
    public function archive()
    {
        // This could return archived academic years, departments, etc.
        return response()->json([
            'success' => true,
            'data' => [],
        ]);
    }

    /**
     * Store a new department
     */
    public function storeDepartment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:departments',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $department = Department::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $department,
            'message' => 'Department created successfully',
        ], 201);
    }

    /**
     * Update a department
     */
    public function updateDepartment(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:departments,code,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $department->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $department,
            'message' => 'Department updated successfully',
        ]);
    }

    /**
     * Delete a department
     */
    public function destroyDepartment($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully',
        ]);
    }

    /**
     * Store a new academic year
     */
    public function storeAcademicYear(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'start_year' => 'required|integer|min:2000|max:2100',
            'end_year' => 'required|integer|min:2000|max:2100|gte:start_year',
            'is_current' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // If setting as current, unset other current years
        if ($request->is_current) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear = AcademicYear::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $academicYear,
            'message' => 'Academic year created successfully',
        ], 201);
    }

    /**
     * Update an academic year
     */
    public function updateAcademicYear(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'start_year' => 'required|integer|min:2000|max:2100',
            'end_year' => 'required|integer|min:2000|max:2100|gte:start_year',
            'is_current' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // If setting as current, unset other current years
        if ($request->is_current) {
            AcademicYear::where('is_current', true)->where('id', '!=', $id)->update(['is_current' => false]);
        }

        $academicYear->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $academicYear,
            'message' => 'Academic year updated successfully',
        ]);
    }

    /**
     * Delete an academic year
     */
    public function destroyAcademicYear($id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Academic year deleted successfully',
        ]);
    }
}