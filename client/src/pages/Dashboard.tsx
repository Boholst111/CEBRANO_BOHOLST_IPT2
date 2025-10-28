import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, GraduationCap, TrendingUp, Calendar } from 'lucide-react';
import { getAxiosClient } from '../lib/apiConfig';

interface Stats {
  students: {
    total: number;
    byCourse: Array<{ course: string; count: number }>;
    byDepartment: Array<{ department: string; count: number }>;
    byYear: Array<{ year: string; count: number }>;
  };
  faculty: {
    total: number;
    byDepartment: Array<{ department: string; count: number }>;
    byEmploymentType: Array<{ type: string; count: number }>;
    byPosition: Array<{ position: string; count: number }>;
    averageSalary: number;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = getAxiosClient();
        const [studentStats, facultyStats] = await Promise.all([
          api.get('/students/stats'),
          api.get('/faculty/stats')
        ]);

        setStats({
          students: studentStats.data.stats,
          faculty: facultyStats.data.stats
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your institution's data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.faculty.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active faculty members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.byCourse.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.faculty.byDepartment.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Academic departments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Students by Course</CardTitle>
            <CardDescription>Distribution of students across courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.students.byCourse.map((item: { course: string; count: number }, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.course || 'Unspecified'}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.count / (stats?.students.total || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faculty by Department</CardTitle>
            <CardDescription>Distribution of faculty across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.faculty.byDepartment.map((item: { department: string; count: number }, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.department || 'Unspecified'}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.count / (stats?.faculty.total || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate('/students')}
            >
              <GraduationCap className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Add New Student</h3>
              <p className="text-sm text-gray-600">Register a new student in the system</p>
            </div>
            <div 
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate('/faculty')}
            >
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Add Faculty Member</h3>
              <p className="text-sm text-gray-600">Add a new faculty member</p>
            </div>
            <div 
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate('/reports')}
            >
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-gray-600">Generate and view detailed reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
