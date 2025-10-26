import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Settings as SettingsIcon, Building, BookOpen, Calendar, Plus, Edit, Archive, Trash2 } from 'lucide-react';
import api from '../lib/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [loading, setLoading] = useState(false);

  // Data states
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  // Dialog states
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAcademicYearForm, setShowAcademicYearForm] = useState(false);

  // Edit states
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingAcademicYear, setEditingAcademicYear] = useState<any>(null);

  // Form data states
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: ''
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    department_id: ''
  });

  const [academicYearForm, setAcademicYearForm] = useState({
    name: '',
    start_year: '',
    end_year: '',
    is_current: false
  });

  const tabs = [
    { id: 'departments', name: 'Departments', icon: Building },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'academic-years', name: 'Academic Years', icon: Calendar },
  ];

  // Fetch functions
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      if (response.data.success && response.data.data) {
        setCourses(response.data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await api.get('/academic-years');
      if (response.data.success) {
        setAcademicYears(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  // Department CRUD
  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.id}`, departmentForm);
        alert('Department updated successfully!');
      } else {
        await api.post('/departments', departmentForm);
        alert('Department created successfully!');
      }
      setShowDepartmentForm(false);
      setEditingDepartment(null);
      setDepartmentForm({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name || '',
      code: department.code || '',
      description: department.description || ''
    });
    setShowDepartmentForm(true);
  };

  const handleArchiveDepartment = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to archive ${name}?`)) return;
    try {
      await api.delete(`/departments/${id}`);
      alert('Department archived successfully!');
      fetchDepartments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to archive department');
    }
  };

  // Course CRUD
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare form data
      const submitData = {
        ...courseForm,
        department_id: courseForm.department_id ? parseInt(courseForm.department_id) : null,
        credits: courseForm.credits ? parseInt(courseForm.credits) : null,
      };
      
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, submitData);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', submitData);
        alert('Course created successfully!');
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      setCourseForm({ name: '', code: '', description: '', credits: '', department_id: '' });
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name || '',
      code: course.code || '',
      description: course.description || '',
      credits: course.credits?.toString() || '',
      department_id: course.department_id?.toString() || ''
    });
    setShowCourseForm(true);
  };

  const handleArchiveCourse = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to archive ${name}?`)) return;
    try {
      await api.delete(`/courses/${id}`);
      alert('Course archived successfully!');
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to archive course');
    }
  };

  // Academic Year CRUD
  const handleAcademicYearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAcademicYear) {
        await api.put(`/academic-years/${editingAcademicYear.id}`, academicYearForm);
        alert('Academic year updated successfully!');
      } else {
        await api.post('/academic-years', academicYearForm);
        alert('Academic year created successfully!');
      }
      setShowAcademicYearForm(false);
      setEditingAcademicYear(null);
      setAcademicYearForm({ name: '', start_year: '', end_year: '', is_current: false });
      fetchAcademicYears();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save academic year');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAcademicYear = (academicYear: any) => {
    setEditingAcademicYear(academicYear);
    setAcademicYearForm({
      name: academicYear.name || '',
      start_year: academicYear.start_year || '',
      end_year: academicYear.end_year || '',
      is_current: academicYear.is_current || false
    });
    setShowAcademicYearForm(true);
  };

  const handleArchiveAcademicYear = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to archive ${name}?`)) return;
    try {
      await api.delete(`/academic-years/${id}/archive`);
      alert('Academic year archived successfully!');
      fetchAcademicYears();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to archive academic year');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchAcademicYears();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage departments, courses, and academic years in a tabbed layout.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'departments' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Departments Management
              </CardTitle>
              <CardDescription>
                Add, edit, and archive department information and structure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Departments ({departments.length})</h3>
                  <Button onClick={() => setShowDepartmentForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.code}</TableCell>
                        <TableCell>{dept.description || 'No description'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDepartment(dept)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveDepartment(dept.id, dept.name)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'courses' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Courses Management
              </CardTitle>
              <CardDescription>
                Manage course information, codes, credits, and descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Courses ({courses.length})</h3>
                  <Button onClick={() => setShowCourseForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.department?.name || 'N/A'}</TableCell>
                        <TableCell>{course.credits || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveCourse(course.id, course.name)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'academic-years' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Academic Years Management
              </CardTitle>
              <CardDescription>
                Manage academic year periods, current year settings, and transitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Academic Years ({academicYears.length})</h3>
                  <Button onClick={() => setShowAcademicYearForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Academic Year
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Years</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicYears.map((year) => (
                      <TableRow key={year.id}>
                        <TableCell className="font-medium">{year.name}</TableCell>
                        <TableCell>{year.start_year} - {year.end_year}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            year.is_current 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {year.is_current ? 'Current' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAcademicYear(year)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveAcademicYear(year.id, year.name)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Department Form Dialog */}
      <Dialog open={showDepartmentForm} onOpenChange={setShowDepartmentForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
            <DialogDescription>
              {editingDepartment ? 'Update department information.' : 'Enter department information to add to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDepartmentSubmit} className="space-y-4">
            <Input
              placeholder="Department Name"
              value={departmentForm.name}
              onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
              required
            />
            <Input
              placeholder="Department Code (e.g., CSP, ENG)"
              value={departmentForm.code}
              onChange={(e) => setDepartmentForm({...departmentForm, code: e.target.value})}
              required
            />
            <Input
              placeholder="Description (optional)"
              value={departmentForm.description}
              onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDepartmentForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingDepartment ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Course Form Dialog */}
      <Dialog open={showCourseForm} onOpenChange={setShowCourseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update course information.' : 'Enter course information to add to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <Input
              placeholder="Course Name"
              value={courseForm.name}
              onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
              required
            />
            <Input
              placeholder="Course Code (e.g., BSIT, BSCS)"
              value={courseForm.code}
              onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
              required
            />
            <select
              value={courseForm.department_id}
              onChange={(e) => setCourseForm({...courseForm, department_id: e.target.value})}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Credits (optional)"
              type="number"
              value={courseForm.credits}
              onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
            />
            <Input
              placeholder="Description (optional)"
              value={courseForm.description}
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCourseForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Academic Year Form Dialog */}
      <Dialog open={showAcademicYearForm} onOpenChange={setShowAcademicYearForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAcademicYear ? 'Edit Academic Year' : 'Add New Academic Year'}</DialogTitle>
            <DialogDescription>
              {editingAcademicYear ? 'Update academic year information.' : 'Enter academic year information to add to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAcademicYearSubmit} className="space-y-4">
            <Input
              placeholder="Academic Year Name (e.g., 2024-2025)"
              value={academicYearForm.name}
              onChange={(e) => setAcademicYearForm({...academicYearForm, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Start Year"
                type="number"
                value={academicYearForm.start_year}
                onChange={(e) => setAcademicYearForm({...academicYearForm, start_year: e.target.value})}
                required
              />
              <Input
                placeholder="End Year"
                type="number"
                value={academicYearForm.end_year}
                onChange={(e) => setAcademicYearForm({...academicYearForm, end_year: e.target.value})}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_current"
                checked={academicYearForm.is_current}
                onChange={(e) => setAcademicYearForm({...academicYearForm, is_current: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_current" className="text-sm font-medium">
                Set as current academic year
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAcademicYearForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingAcademicYear ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
