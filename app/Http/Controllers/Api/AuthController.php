<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and return token
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are invalid.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|in:admin,faculty,student',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'student',
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 201);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $data = $user;

        // Load role-specific data
        if ($user->role === 'student') {
            $student = $user->student()->with(['course.department', 'academicYear'])->first();
            if ($student) {
                $data = array_merge($user->toArray(), $student->toArray());
            }
        } elseif ($user->role === 'faculty') {
            $faculty = $user->faculty()->with('department')->first();
            if ($faculty) {
                $data = array_merge($user->toArray(), $faculty->toArray());
            }
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'data' => $data
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $request->user()->id,
            'password' => 'sometimes|string|min:6',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
        ]);

        $user = $request->user();

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
        }

        if (isset($validated['address'])) {
            $user->address = $validated['address'];
        }

        $user->save();

        // Load role-specific data for response
        $data = $user;
        if ($user->role === 'student') {
            $student = $user->student()->with(['course.department', 'academicYear'])->first();
            if ($student) {
                $data = array_merge($user->toArray(), $student->toArray());
            }
        } elseif ($user->role === 'faculty') {
            $faculty = $user->faculty()->with('department')->first();
            if ($faculty) {
                $data = array_merge($user->toArray(), $faculty->toArray());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user,
            'data' => $data
        ]);
    }

    /**
     * Logout user (revoke tokens)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Refresh token (create new one)
     */
    public function refresh(Request $request)
    {
        // Revoke old token and create new one
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'token' => $request->user()->createToken('auth_token')->plainTextToken,
        ]);
    }
}
