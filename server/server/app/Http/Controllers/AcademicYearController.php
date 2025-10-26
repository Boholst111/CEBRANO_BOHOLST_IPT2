<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years
     */
    public function index()
    {
        $academicYears = AcademicYear::orderBy('year_start', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $academicYears,
        ]);
    }

    /**
     * Store a newly created academic year
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_year' => 'required|integer|min:2000|max:2100',
            'end_year' => 'required|integer|min:2000|max:2100|gte:start_year',
            'is_current' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If setting as current, unset other current years
        if ($request->is_current) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear = AcademicYear::create([
            'name' => $request->name,
            'start_year' => $request->start_year,
            'end_year' => $request->end_year,
            'is_current' => $request->is_current ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Academic year created successfully',
            'data' => $academicYear,
        ], 201);
    }

    /**
     * Display the specified academic year
     */
    public function show(AcademicYear $academicYear)
    {
        return response()->json([
            'success' => true,
            'data' => $academicYear,
        ]);
    }

    /**
     * Update the specified academic year
     */
    public function update(Request $request, AcademicYear $academicYear)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_year' => 'required|integer|min:2000|max:2100',
            'end_year' => 'required|integer|min:2000|max:2100|gte:start_year',
            'is_current' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If setting as current, unset other current years
        if ($request->is_current && !$academicYear->is_current) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear->update([
            'name' => $request->name,
            'start_year' => $request->start_year,
            'end_year' => $request->end_year,
            'is_current' => $request->is_current ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Academic year updated successfully',
            'data' => $academicYear,
        ]);
    }

    /**
     * Archive the specified academic year
     */
    public function archive(AcademicYear $academicYear)
    {
        // Check if academic year has students
        $studentCount = $academicYear->students()->count();

        if ($studentCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot archive academic year with enrolled students. Please reassign students first.',
            ], 422);
        }

        $academicYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Academic year archived successfully',
        ]);
    }

    /**
     * Remove the specified academic year
     */
    public function destroy(AcademicYear $academicYear)
    {
        // Check if academic year has students
        $studentCount = $academicYear->students()->count();

        if ($studentCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete academic year with enrolled students. Please reassign students first.',
            ], 422);
        }

        $academicYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Academic year deleted successfully',
        ]);
    }
}