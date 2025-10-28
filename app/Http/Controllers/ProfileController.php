<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function show(Request $request)
    {
        $user = Auth::user();

        $profileData = null;

        if ($user->role === 'student') {
            $profileData = Student::with(['course', 'department', 'academicYear'])
                ->where('user_id', $user->id)
                ->first();
        } elseif ($user->role === 'faculty') {
            $profileData = Faculty::with(['department'])
                ->where('user_id', $user->id)
                ->first();
        } elseif ($user->role === 'admin') {
            // For admin users, return phone and address from the users table
            $profileData = [
                'phone' => $user->phone,
                'address' => $user->address,
            ];
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'data' => $profileData,
        ]);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        \Log::info('Profile update request', [
            'user_id' => $user->id,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update user basic info
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // For admin users, also update phone and address in the users table
        if ($user->role === 'admin') {
            $userData['phone'] = $request->phone;
            $userData['address'] = $request->address;
        }

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        // Update role-specific data
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                $student->update([
                    'phone' => $request->input('phone'),
                    'address' => $request->input('address'),
                ]);
            } else {
                \Log::error('Student record not found for user', ['user_id' => $user->id]);
            }
        } elseif ($user->role === 'faculty') {
            $faculty = Faculty::where('user_id', $user->id)->first();
            if ($faculty) {
                $faculty->update([
                    'phone' => $request->input('phone'),
                    'address' => $request->input('address'),
                ]);
            } else {
                \Log::error('Faculty record not found for user', ['user_id' => $user->id]);
            }
        }

        // Return updated profile data
        return $this->show($request);
    }
}