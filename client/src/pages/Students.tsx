import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Plus, Search, Edit, Archive, Filter } from 'lucide-react';
import api from '../lib/api';

const Students: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    student_id: '',
    course_id: '1', // Default to first course
    department_id: '1', // Default to first department  
    academic_year: '', // Manual text input
    enrollment_date: '',
    phone: '',
    address: ''
  });
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [allCourses] = useState([
    // Computer Studies Program courses
    { id: 1, name: 'BSIT', department_id: 1 },
    { id: 2, name: 'BSCS', department_id: 1 },
    { id: 3, name: 'BLIS', department_id: 1 },
    { id: 4, name: 'BSEMC', department_id: 1 },
    // Engineering Program courses
    { id: 5, name: 'BSCE', department_id: 2 },
    { id: 6, name: 'BSIE', department_id: 2 },
    { id: 7, name: 'BSGE', department_id: 2 },
    { id: 8, name: 'BSME', department_id: 2 },
    // Teacher Education Program courses
    { id: 9, name: 'BSE Major in English', department_id: 3 },
    { id: 10, name: 'BSE Major in Mathematics', department_id: 3 },
    { id: 11, name: 'BSE Major in Biology', department_id: 3 },
    { id: 12, name: 'BSE Major in Chemistry', department_id: 3 }
  ]);
  
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      if (response.data.success && Array.isArray(response.data.data)) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStudents = async (search = '', departmentFilter = '', courseFilter = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentFilter) params.append('department_id', departmentFilter);
      if (courseFilter) params.append('course_id', courseFilter);
      
      const response = await api.get(`/students?${params.toString()}`);
      
      // Handle the correct response format from backend
      if (response.data.students && Array.isArray(response.data.students)) {
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } else {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      setError(error.response?.data?.message || 'Failed to fetch student data');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on selected department
  const filterCoursesByDepartment = (departmentId: string) => {
    const filtered = allCourses.filter(course => course.department_id === parseInt(departmentId));
    setAvailableCourses(filtered);
    // Reset course selection when department changes
    setFormData(prev => ({ ...prev, course_id: filtered.length > 0 ? filtered[0].id.toString() : '' }));
  };

  useEffect(() => {
    fetchDepartments();
    fetchStudents();
    // Initialize with first department's courses
    filterCoursesByDepartment('1');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(searchTerm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/students', formData);
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        student_id: '',
        course_id: '1',
        department_id: '1',
        academic_year: '',
        enrollment_date: '',
        phone: '',
        address: ''
      });
      fetchStudents(searchTerm);
      alert('Student added successfully!');
    } catch (error: any) {
      console.error('Error adding student:', error);
      alert(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Filter courses when department changes
    if (name === 'department_id') {
      filterCoursesByDepartment(value);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    fetchStudents(searchTerm, filterDepartment, filterCourse);
  };

  // Handle edit student
  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      password: '', // Don't prefill password
      student_id: student.student_id || '',
      course_id: student.course_id?.toString() || '1',
      department_id: student.department_id?.toString() || '1',
      academic_year: student.academic_year || '',
      enrollment_date: student.date_enrolled || '',
      phone: student.phone || '',
      address: student.address || ''
    });
    setShowEditForm(true);
  };

  // Handle update student
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      setLoading(true);
      await api.put(`/students/${editingStudent.id}`, formData);
      setShowEditForm(false);
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        student_id: '',
        course_id: '1',
        department_id: '1',
        academic_year: '',
        enrollment_date: '',
        phone: '',
        address: ''
      });
      fetchStudents(searchTerm, filterDepartment, filterCourse);
      alert('Student updated successfully!');
    } catch (error: any) {
      console.error('Error updating student:', error);
      alert(error.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  // Handle archive student
  const handleArchive = async (studentId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to archive ${studentName}? This action can be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/students/${studentId}`);
      fetchStudents(searchTerm, filterDepartment, filterCourse);
      alert('Student archived successfully!');
    } catch (error: any) {
      console.error('Error archiving student:', error);
      alert(error.response?.data?.message || 'Failed to archive student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records and academic information</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
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
            
            {/* Filters */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Course
                </label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Courses</option>
                  {allCourses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button onClick={handleFilterChange} variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              
              <Button 
                onClick={() => {
                  setFilterDepartment('');
                  setFilterCourse('');
                  setSearchTerm('');
                  fetchStudents();
                }} 
                variant="outline"
              >
                Clear All
              </Button>
            </div>
          </div>
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
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id || index}>
                    <TableCell className="font-medium">
                      {student.student_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.user_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.user_email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.course_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.department_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.academic_year || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'graduated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status || 'active'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleArchive(student.id, student.user?.name || 'Student')}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
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

      {/* Add Student Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter student information to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="student_id"
                placeholder="Student ID"
                value={formData.student_id}
                onChange={handleInputChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Course</option>
                {availableCourses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="academic_year"
                placeholder="Academic Year (e.g., 2024-2025)"
                value={formData.academic_year}
                onChange={handleInputChange}
                required
              />
              <Input
                name="enrollment_date"
                type="date"
                placeholder="Enrollment Date"
                value={formData.enrollment_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="student_id"
                placeholder="Student ID"
                value={formData.student_id}
                onChange={handleInputChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="academic_year"
                placeholder="Academic Year (e.g., 2024-2025)"
                value={formData.academic_year}
                onChange={handleInputChange}
                required
              />
              <Input
                name="enrollment_date"
                type="date"
                placeholder="Enrollment Date"
                value={formData.enrollment_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
