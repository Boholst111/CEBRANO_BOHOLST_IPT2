import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FileText, Download, BarChart3, Filter, Eye } from 'lucide-react';
import api from '../lib/api';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'faculty'>('student');
  
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
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [employmentTypes] = useState([
    { id: 'full-time', name: 'Full-time' },
    { id: 'part-time', name: 'Part-time' },
    { id: 'contractual', name: 'Contractual' }
  ]);

  // Fetch departments dynamically
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

  // Fetch courses dynamically
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch academic years dynamically
  const fetchAcademicYears = async () => {
    try {
      const response = await api.get('/academic-years');
      if (response.data.success && Array.isArray(response.data.data)) {
        setAcademicYears(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

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
      
      const response = await api.get(`/reports/students?${params.toString()}`);
      
      if (response.data.success) {
        if (format) {
          alert(`${format.toUpperCase()} report generated successfully! ${response.data.message}`);
          if (response.data.download_url) {
            // Create a proper download link with full API URL
            const downloadLink = document.createElement('a');
            const baseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
            const fullUrl = `${baseUrl}/reports${response.data.download_url}`;
            downloadLink.href = fullUrl;
            downloadLink.download = response.data.download_url.split('/').pop() || `report.${format}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        } else {
          setReportData(response.data);
          setActiveTab('student');
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
      
      const response = await api.get(`/reports/faculty?${params.toString()}`);
      
      if (response.data.success) {
        if (format) {
          alert(`${format.toUpperCase()} report generated successfully! ${response.data.message}`);
          if (response.data.download_url) {
            // Create a proper download link with full API URL
            const downloadLink = document.createElement('a');
            const baseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
            const fullUrl = `${baseUrl}/reports${response.data.download_url}`;
            downloadLink.href = fullUrl;
            downloadLink.download = response.data.download_url.split('/').pop() || `report.${format}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        } else {
          setReportData(response.data);
          setActiveTab('faculty');
        }
      }
    } catch (error: any) {
      console.error('Error generating faculty report:', error);
      alert(error.response?.data?.message || 'Failed to generate faculty report');
    } finally {
      setLoading(false);
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
                
                <select
                  value={studentFilters.academic_year}
                  onChange={(e) => setStudentFilters({...studentFilters, academic_year: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Academic Years</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.year || year.start_year}>
                      {year.year || year.start_year}
                    </option>
                  ))}
                </select>
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
                  {employmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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

      {/* Report Preview - Single Preview That Switches Between Student and Faculty */}
      {reportData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {activeTab === 'student' ? 'Student' : 'Faculty'} Report Preview
                </CardTitle>
                <CardDescription>
                  Total {activeTab === 'student' ? 'Students' : 'Faculty'}: {reportData.data?.statistics?.total || 0}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'student' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('student')}
                >
                  Student Report
                </Button>
                <Button
                  variant={activeTab === 'faculty' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('faculty')}
                >
                  Faculty Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'student' ? (
              // Student Report Preview
              reportData.data?.students && reportData.data.students.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Total Students</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.data?.statistics?.total || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">By Course</p>
                      <p className="text-sm text-green-900">{reportData.data?.statistics?.byCourse?.length || 0} courses</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">By Department</p>
                      <p className="text-sm text-purple-900">{reportData.data?.statistics?.byDepartment?.length || 0} departments</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Academic Years</p>
                      <p className="text-sm text-orange-900">{reportData.data?.statistics?.byAcademicYear?.length || 0} years</p>
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
                      {reportData.data.students.slice(0, 10).map((student: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>{student.user_name}</TableCell>
                          <TableCell>{student.course_code}</TableCell>
                          <TableCell>{student.department_name}</TableCell>
                          <TableCell>{student.academic_year}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {reportData.data.students.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      Showing first 10 of {reportData.data.students.length} students. Export to see all data.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No student data found for the selected filters.</p>
              )
            ) : (
              // Faculty Report Preview
              reportData.data?.faculty && reportData.data.faculty.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Total Faculty</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.data?.statistics?.total || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Avg Salary</p>
                      <p className="text-sm text-green-900">${reportData.data?.statistics?.averageSalary?.toFixed(0) || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Departments</p>
                      <p className="text-sm text-purple-900">{reportData.data?.statistics?.byDepartment?.length || 0} departments</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Employment Types</p>
                      <p className="text-sm text-orange-900">{reportData.data?.statistics?.byEmploymentType?.length || 0} types</p>
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
                      {reportData.data.faculty.slice(0, 10).map((faculty: any, index: number) => (
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
                  {reportData.data.faculty.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      Showing first 10 of {reportData.data.faculty.length} faculty. Export to see all data.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No faculty data found for the selected filters.</p>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
