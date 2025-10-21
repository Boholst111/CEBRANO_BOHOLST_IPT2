import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FileText, Download, BarChart3, Filter, Eye } from 'lucide-react';
import api from '../lib/api';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [studentReportData, setStudentReportData] = useState<any>(null);
  const [facultyReportData, setFacultyReportData] = useState<any>(null);
  const [showStudentPreview, setShowStudentPreview] = useState(false);
  const [showFacultyPreview, setShowFacultyPreview] = useState(false);
  
  // Filter states
  const [studentFilters, setStudentFilters] = useState({
    course_id: '',
    department_id: '',
    academic_year: ''
  });
  
  const [facultyFilters, setFacultyFilters] = useState({
    department_id: '',
    employment_type: ''
  });

  // Dropdown data
  const [departments] = useState([
    { id: 1, name: 'Computer Studies Program' },
    { id: 2, name: 'Engineering Program' },
    { id: 3, name: 'Teacher Education Program' }
  ]);
  
  const [courses] = useState([
    { id: 1, name: 'BSIT', department_id: 1 },
    { id: 2, name: 'BSCS', department_id: 1 },
    { id: 3, name: 'BLIS', department_id: 1 },
    { id: 4, name: 'BSEMC', department_id: 1 },
    { id: 5, name: 'BSCE', department_id: 2 },
    { id: 6, name: 'BSME', department_id: 2 },
    { id: 7, name: 'BSEE', department_id: 2 },
    { id: 8, name: 'BSIE', department_id: 2 },
    { id: 9, name: 'BSGE', department_id: 2 },
    { id: 10, name: 'BSE Major in English', department_id: 3 },
    { id: 11, name: 'BSE Major in Mathematics', department_id: 3 },
    { id: 12, name: 'BSE Major in Biology', department_id: 3 },
    { id: 13, name: 'BSE Major in Chemistry', department_id: 3 }
  ]);

  // Generate report with filters
  const generateStudentReport = async (format?: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (studentFilters.course_id) params.append('course_id', studentFilters.course_id);
      if (studentFilters.department_id) params.append('department_id', studentFilters.department_id);
      if (studentFilters.academic_year) params.append('academic_year', studentFilters.academic_year);
      if (format) params.append('format', format);
      
      console.log('Student filters being sent:', studentFilters);
      console.log('Query params:', params.toString());
      
      const response = await api.get(`/reports/students?${params.toString()}`);
      
      if (response.data.success) {
        if (format) {
          alert(`${format.toUpperCase()} report generated successfully! ${response.data.message}`);
          if (response.data.download_url) {
            window.open(response.data.download_url, '_blank');
          }
        } else {
          setStudentReportData(response.data);
          setShowStudentPreview(true);
        }
      }
    } catch (error: any) {
      console.error('Error generating student report:', error);
      alert(error.response?.data?.message || 'Failed to generate student report');
    } finally {
      setLoading(false);
    }
  };

  const generateFacultyReport = async (format?: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (facultyFilters.department_id) params.append('department_id', facultyFilters.department_id);
      if (facultyFilters.employment_type) params.append('employment_type', facultyFilters.employment_type);
      if (format) params.append('format', format);
      
      console.log('Faculty filters being sent:', facultyFilters);
      console.log('Query params:', params.toString());
      
      const response = await api.get(`/reports/faculty?${params.toString()}`);
      
      if (response.data.success) {
        if (format) {
          alert(`${format.toUpperCase()} report generated successfully! ${response.data.message}`);
          if (response.data.download_url) {
            window.open(response.data.download_url, '_blank');
          }
        } else {
          setFacultyReportData(response.data);
          setShowFacultyPreview(true);
        }
      }
    } catch (error: any) {
      console.error('Error generating faculty report:', error);
      alert(error.response?.data?.message || 'Failed to generate faculty report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">
          Generate comprehensive reports for students and faculty with advanced filtering options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Student Reports
            </CardTitle>
            <CardDescription>
              Generate detailed reports filtered by course and department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student Filters */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm">Filter Options:</h4>
              
              <div className="grid grid-cols-1 gap-3">
                <select
                  value={studentFilters.course_id}
                  onChange={(e) => setStudentFilters({...studentFilters, course_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={studentFilters.department_id}
                  onChange={(e) => setStudentFilters({...studentFilters, department_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                
                <Input
                  placeholder="Academic Year (e.g., 2024-2025)"
                  value={studentFilters.academic_year}
                  onChange={(e) => setStudentFilters({...studentFilters, academic_year: e.target.value})}
                />
              </div>
            </div>

            {/* Student Report Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => generateStudentReport()}
                disabled={loading}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Report
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => generateStudentReport('pdf')}
                  disabled={loading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => generateStudentReport('excel')}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Faculty Reports
            </CardTitle>
            <CardDescription>
              Generate comprehensive faculty reports filtered by department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Faculty Filters */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm">Filter Options:</h4>
              
              <div className="grid grid-cols-1 gap-3">
                <select
                  value={facultyFilters.department_id}
                  onChange={(e) => setFacultyFilters({...facultyFilters, department_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={facultyFilters.employment_type}
                  onChange={(e) => setFacultyFilters({...facultyFilters, employment_type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Employment Types</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Faculty Report Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => generateFacultyReport()}
                disabled={loading}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Report
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => generateFacultyReport('pdf')}
                  disabled={loading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => generateFacultyReport('excel')}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Report Preview */}
      {showStudentPreview && studentReportData && (
        <Card>
          <CardHeader>
            <CardTitle>Student Report Preview</CardTitle>
            <CardDescription>
              Total Students: {studentReportData.data?.statistics?.total || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentReportData.data && studentReportData.data.students && studentReportData.data.students.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Students</p>
                    <p className="text-2xl font-bold text-blue-900">{studentReportData.data?.statistics?.total || 0}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">By Course</p>
                    <p className="text-sm text-green-900">{studentReportData.data?.statistics?.byCourse?.length || 0} courses</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">By Department</p>
                    <p className="text-sm text-purple-900">{studentReportData.data?.statistics?.byDepartment?.length || 0} departments</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Academic Years</p>
                    <p className="text-sm text-orange-900">{studentReportData.data?.statistics?.byAcademicYear?.length || 0} years</p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Academic Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentReportData.data.students.slice(0, 10).map((student: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{student.student_id}</TableCell>
                        <TableCell>{student.user_name}</TableCell>
                        <TableCell>{student.course_name}</TableCell>
                        <TableCell>{student.department_name}</TableCell>
                        <TableCell>{student.academic_year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {studentReportData.data.students.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing first 10 of {studentReportData.data.students.length} students. Export to see all data.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No student data found for the selected filters.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Faculty Report Preview */}
      {showFacultyPreview && facultyReportData && (
        <Card>
          <CardHeader>
            <CardTitle>Faculty Report Preview</CardTitle>
            <CardDescription>
              Total Faculty: {facultyReportData.data?.statistics?.total || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {facultyReportData.data && facultyReportData.data.faculty && facultyReportData.data.faculty.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Faculty</p>
                    <p className="text-2xl font-bold text-blue-900">{facultyReportData.data?.statistics?.total || 0}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Avg Salary</p>
                    <p className="text-sm text-green-900">${facultyReportData.data?.statistics?.averageSalary?.toFixed(0) || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Departments</p>
                    <p className="text-sm text-purple-900">{facultyReportData.data?.statistics?.byDepartment?.length || 0} departments</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Employment Types</p>
                    <p className="text-sm text-orange-900">{facultyReportData.data?.statistics?.byEmploymentType?.length || 0} types</p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Employment Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facultyReportData.data.faculty.slice(0, 10).map((faculty: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{faculty.employee_id}</TableCell>
                        <TableCell>{faculty.user_name}</TableCell>
                        <TableCell>{faculty.department_name || 'N/A'}</TableCell>
                        <TableCell>{faculty.position}</TableCell>
                        <TableCell>{faculty.employment_type?.replace('_', ' ').toUpperCase()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {facultyReportData.data.faculty.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing first 10 of {facultyReportData.data.faculty.length} faculty. Export to see all data.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No faculty data found for the selected filters.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
