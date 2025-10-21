import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search } from 'lucide-react';
import api from '../lib/api';

const Students: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/students?search=${search}`);
      
      console.log('Students API Response:', response.data);
      
      // Handle different possible response formats
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
          setStudents(response.data.data.data);
        } else {
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      setError(error.response?.data?.message || 'Failed to fetch student data');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(searchTerm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records and academic information</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Complete list of students with course and department filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => fetchStudents()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found.</p>
              <p className="text-sm text-gray-400 mt-2">
                The student data will appear here once the Laravel backend is properly connected.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id || index}>
                    <TableCell className="font-medium">
                      {student.student_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.user?.name || 
                       `${student.first_name || ''} ${student.last_name || ''}`.trim() || 
                       'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.user?.email || student.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.course?.name || student.course || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.department?.name || student.department || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'graduated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Module Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600">✅ Implemented:</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Complete Laravel API with CRUD operations</li>
                <li>• Course and department filtering</li>
                <li>• Role-based access control (Admin only)</li>
                <li>• GPA tracking and academic progress</li>
                <li>• MySQL database with relationships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">🔄 Ready to Connect:</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Add/Edit student forms</li>
                <li>• Course and department filtering</li>
                <li>• Academic year selection</li>
                <li>• Student profile viewing</li>
                <li>• Enrollment management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
