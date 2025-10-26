#!/usr/bin/env php
<?php
/**
 * API Testing Script for Laravel Backend
 * Usage: php api-test.php
 * 
 * This script tests all API endpoints without needing Postman
 */

class APITester
{
    private $baseURL = 'http://127.0.0.1:8000/api';
    private $token = null;
    private $testUser = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123'
    ];

    public function __construct()
    {
        echo "🧪 API Testing Suite for Laravel Backend\n";
        echo "Base URL: {$this->baseURL}\n";
        echo str_repeat("=", 50) . "\n\n";
    }

    /**
     * Make HTTP request
     */
    private function request($method, $endpoint, $data = null, $includeToken = false)
    {
        $url = "{$this->baseURL}{$endpoint}";
        
        $options = [
            'http' => [
                'method' => $method,
                'header' => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                ],
                'ignore_errors' => true,
            ],
        ];

        if ($includeToken && $this->token) {
            $options['http']['header'][] = "Authorization: Bearer {$this->token}";
        }

        if ($data) {
            $options['http']['content'] = json_encode($data);
        }

        $context = stream_context_create($options);
        $response = @file_get_contents($url, false, $context);
        
        return [
            'status' => isset($http_response_header) ? 
                (int)substr($http_response_header[0], 9, 3) : 0,
            'body' => $response ? json_decode($response, true) : null,
            'headers' => $http_response_header ?? []
        ];
    }

    /**
     * Test authentication endpoints
     */
    public function testAuthentication()
    {
        echo "📝 PHASE 1: Authentication Testing\n";
        echo str_repeat("-", 50) . "\n";

        // Register
        echo "1. Testing Registration...\n";
        $registerResp = $this->request('POST', '/auth/register', $this->testUser);
        echo "   Status: {$registerResp['status']}\n";
        if ($registerResp['status'] === 201 || $registerResp['status'] === 200) {
            echo "   ✅ Registration successful\n";
        } elseif ($registerResp['status'] === 422) {
            echo "   ⚠️  User already exists (expected)\n";
        } else {
            echo "   ❌ Failed\n";
        }

        // Login
        echo "\n2. Testing Login...\n";
        $loginResp = $this->request('POST', '/auth/login', [
            'email' => $this->testUser['email'],
            'password' => $this->testUser['password']
        ]);
        echo "   Status: {$loginResp['status']}\n";
        
        if ($loginResp['status'] === 200 && isset($loginResp['body']['token'])) {
            $this->token = $loginResp['body']['token'];
            echo "   ✅ Login successful, token obtained\n";
        } else {
            echo "   ❌ Login failed\n";
            echo "   Response: " . json_encode($loginResp['body']) . "\n";
        }

        // Get current user
        echo "\n3. Testing Get Current User...\n";
        $meResp = $this->request('GET', '/auth/me', null, true);
        echo "   Status: {$meResp['status']}\n";
        if ($meResp['status'] === 200) {
            echo "   ✅ Retrieved current user\n";
            echo "   User: " . $meResp['body']['data']['name'] . " ({$meResp['body']['data']['email']})\n";
        } else {
            echo "   ❌ Failed\n";
        }

        echo "\n";
    }

    /**
     * Test protected endpoints
     */
    public function testProtectedEndpoints()
    {
        if (!$this->token) {
            echo "❌ No token available. Cannot test protected endpoints.\n";
            return;
        }

        echo "🔒 PHASE 2: Protected Endpoints Testing\n";
        echo str_repeat("-", 50) . "\n";

        // Test Students
        echo "1. Testing Students Endpoint...\n";
        $studentsResp = $this->request('GET', '/students', null, true);
        echo "   Status: {$studentsResp['status']}\n";
        if ($studentsResp['status'] === 200) {
            $count = count($studentsResp['body']['data'] ?? []);
            echo "   ✅ Retrieved {$count} students\n";
        } else {
            echo "   ❌ Failed\n";
        }

        // Test Faculty
        echo "\n2. Testing Faculty Endpoint...\n";
        $facultyResp = $this->request('GET', '/faculty', null, true);
        echo "   Status: {$facultyResp['status']}\n";
        if ($facultyResp['status'] === 200) {
            $count = count($facultyResp['body']['data'] ?? []);
            echo "   ✅ Retrieved {$count} faculty members\n";
        } else {
            echo "   ❌ Failed\n";
        }

        // Test Courses
        echo "\n3. Testing Courses Endpoint...\n";
        $coursesResp = $this->request('GET', '/courses', null, true);
        echo "   Status: {$coursesResp['status']}\n";
        if ($coursesResp['status'] === 200) {
            $count = count($coursesResp['body']['data'] ?? []);
            echo "   ✅ Retrieved {$count} courses\n";
        } else {
            echo "   ❌ Failed\n";
        }

        // Test Departments
        echo "\n4. Testing Departments Endpoint...\n";
        $deptsResp = $this->request('GET', '/departments', null, true);
        echo "   Status: {$deptsResp['status']}\n";
        if ($deptsResp['status'] === 200) {
            $count = count($deptsResp['body']['data'] ?? []);
            echo "   ✅ Retrieved {$count} departments\n";
        } else {
            echo "   ❌ Failed\n";
        }

        // Test Reports
        echo "\n5. Testing Reports Endpoints...\n";
        $reports = [
            '/reports/dashboard' => 'Dashboard',
            '/reports/enrollment' => 'Enrollment',
            '/reports/enrollment-by-department' => 'Enrollment by Dept',
            '/reports/faculty-distribution' => 'Faculty Distribution',
            '/reports/academic-years' => 'Academic Years',
            '/reports/courses' => 'Course Statistics',
            '/reports/students-by-year' => 'Students by Year',
            '/reports/health' => 'System Health',
            '/reports/students' => 'Student Details',
            '/reports/faculty' => 'Faculty Details',
        ];

        foreach ($reports as $endpoint => $name) {
            $resp = $this->request('GET', $endpoint, null, true);
            $status = $resp['status'] === 200 ? "✅" : "❌";
            echo "   {$status} {$name}: {$resp['status']}\n";
        }

        echo "\n";
    }

    /**
     * Test export endpoints
     */
    public function testExports()
    {
        echo "📊 PHASE 3: Export Endpoints Testing\n";
        echo str_repeat("-", 50) . "\n";

        $exports = [
            '/export/students/excel' => 'Students Excel',
            '/export/students/pdf' => 'Students PDF',
            '/export/faculty/excel' => 'Faculty Excel',
            '/export/faculty/pdf' => 'Faculty PDF',
            '/export/enrollment/excel' => 'Enrollment Excel',
            '/export/enrollment/pdf' => 'Enrollment PDF',
        ];

        foreach ($exports as $endpoint => $name) {
            $resp = $this->request('GET', $endpoint, null, true);
            $status = ($resp['status'] === 200 || $resp['status'] === 302) ? "✅" : "❌";
            echo "{$status} {$name}: {$resp['status']}\n";
        }

        echo "\n";
    }

    /**
     * Test error handling
     */
    public function testErrorHandling()
    {
        echo "⚠️  PHASE 4: Error Handling Testing\n";
        echo str_repeat("-", 50) . "\n";

        // Test 401 - Unauthorized (without token)
        echo "1. Testing 401 Unauthorized (no token)...\n";
        $resp = $this->request('GET', '/students', null, false);
        echo "   Status: {$resp['status']}\n";
        echo "   " . ($resp['status'] === 401 ? "✅" : "⚠️ ") . " Expected 401\n";

        // Test 404 - Not Found
        echo "\n2. Testing 404 Not Found...\n";
        $resp = $this->request('GET', '/nonexistent/endpoint', null, true);
        echo "   Status: {$resp['status']}\n";
        echo "   " . ($resp['status'] === 404 ? "✅" : "⚠️ ") . " Expected 404\n";

        echo "\n";
    }

    /**
     * Run all tests
     */
    public function runAllTests()
    {
        $this->testAuthentication();
        
        if ($this->token) {
            $this->testProtectedEndpoints();
            $this->testExports();
            $this->testErrorHandling();
            
            echo "\n" . str_repeat("=", 50) . "\n";
            echo "✅ Testing complete!\n";
            echo "Token: " . substr($this->token, 0, 20) . "...\n";
            echo "\nYou can now use this token to test with Postman:\n";
            echo "Authorization: Bearer {$this->token}\n";
        } else {
            echo "❌ Tests failed - could not obtain authentication token\n";
        }
    }
}

// Run tests
$tester = new APITester();
$tester->runAllTests();
