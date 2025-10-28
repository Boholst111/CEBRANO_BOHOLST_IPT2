<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class FacultyController extends Controller
{
    /**
     * Get all faculty with pagination and filters
     */
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $search = $request->query('search');
        $departmentId = $request->query('department_id');

        $query = Faculty::with('user', 'department');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('employee_id', 'like', "%{$search}%");
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        $total = $query->count();
        $faculty = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'faculty' => $faculty->items(),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit),
            ],
        ]);
    }

    /**
     * Get single faculty member
     */
    public function show($id)
    {
        $faculty = Faculty::with('user', 'department')->find($id);

        if (!$faculty) {
            return response()->json(['error' => 'Faculty member not found'], 404);
        }

        return response()->json(['faculty' => $faculty]);
    }

    /**
     * Create new faculty member
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'employee_id' => 'required|string|unique:faculty',
            'department_id' => 'sometimes|integer|exists:departments,id',
            'position' => 'sometimes|string|max:100',
            'employment_type' => 'sometimes|in:full_time,part_time,contract',
            'salary' => 'sometimes|numeric',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'qualifications' => 'sometimes|string',
            'specializations' => 'sometimes|string',
        ]);

        // Create user first
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'faculty',
        ]);

        // Then create faculty record
        $faculty = Faculty::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'department_id' => $validated['department_id'] ?? null,
            'position' => $validated['position'] ?? null,
            'employment_type' => $validated['employment_type'] ?? 'full_time',
            'salary' => $validated['salary'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'specializations' => $validated['specializations'] ?? null,
        ]);

        return response()->json(['faculty' => $faculty->load('user', 'department')], 201);
    }

    /**
     * Update faculty member
     */
    public function update(Request $request, $id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json(['error' => 'Faculty member not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $faculty->user_id,
            'department_id' => 'sometimes|integer|exists:departments,id',
            'position' => 'sometimes|string|max:100',
            'employment_type' => 'sometimes|in:full_time,part_time,contract',
            'salary' => 'sometimes|numeric',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'qualifications' => 'sometimes|string',
            'specializations' => 'sometimes|string',
        ]);

        // Update user if name or email provided
        if (isset($validated['name']) || isset($validated['email'])) {
            $faculty->user->update([
                'name' => $validated['name'] ?? $faculty->user->name,
                'email' => $validated['email'] ?? $faculty->user->email,
            ]);
        }

        // Update faculty record
        $faculty->update($validated);

        return response()->json(['faculty' => $faculty->load('user', 'department')]);
    }

    /**
     * Delete faculty member
     */
    public function destroy($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json(['error' => 'Faculty member not found'], 404);
        }

        $userId = $faculty->user_id;
        $faculty->delete();
        User::find($userId)->delete();

        return response()->json(['message' => 'Faculty member deleted successfully']);
    }

    /**
     * Get faculty statistics
     */
    public function statistics()
    {
        try {
            $faculty = Faculty::with('department')->get();
            
            $byDepartment = $faculty->groupBy(function($item) {
                return $item->department->name ?? 'Unknown';
            })->map(function($group) {
                return ['department' => $group->first()->department->name ?? 'Unknown', 'count' => $group->count()];
            })->values();
            
            $byEmploymentType = $faculty->groupBy('employment_type')->map(function($group) {
                return ['type' => $group->first()->employment_type ?? 'Unknown', 'count' => $group->count()];
            })->values();
            
            $byPosition = $faculty->groupBy('position')->map(function($group) {
                return ['position' => $group->first()->position ?? 'Unknown', 'count' => $group->count()];
            })->values();
            
            $averageSalary = $faculty->avg('salary') ?? 0;
            
            return response()->json([
                'stats' => [
                    'total' => $faculty->count(),
                    'byDepartment' => $byDepartment,
                    'byEmploymentType' => $byEmploymentType,
                    'byPosition' => $byPosition,
                    'averageSalary' => round($averageSalary, 2),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
