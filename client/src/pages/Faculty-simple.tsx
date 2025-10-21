import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search } from 'lucide-react';
import api from '../lib/api';

const Faculty: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchFaculty = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/faculty?search=${search}`);
      
      console.log('Faculty API Response:', response.data);
      
      // Handle different possible response formats
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          setFaculty(response.data.data);
        } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
          setFaculty(response.data.data.data);
        } else {
          setFaculty([]);
        }
      } else {
        setFaculty([]);
      }
    } catch (error: any) {
      console.error('Error fetching faculty:', error);
      setError(error.response?.data?.message || 'Failed to fetch faculty data');
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFaculty(searchTerm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600">Manage faculty members and their information</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search faculty by name or employee ID..."
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

      {/* Faculty Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty List</CardTitle>
          <CardDescription>
            Complete list of faculty members with department filtering and search
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
              <Button onClick={() => fetchFaculty()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No faculty members found.</p>
              <p className="text-sm text-gray-400 mt-2">
                The faculty data will appear here once the Laravel backend is properly connected.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((facultyMember, index) => (
                  <TableRow key={facultyMember.id || index}>
                    <TableCell className="font-medium">
                      {facultyMember.employee_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {facultyMember.user?.name || 
                       `${facultyMember.first_name || ''} ${facultyMember.last_name || ''}`.trim() || 
                       'N/A'}
                    </TableCell>
                    <TableCell>
                      {facultyMember.user?.email || facultyMember.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {facultyMember.department?.name || facultyMember.department || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {facultyMember.position || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        facultyMember.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {facultyMember.status || 'Unknown'}
                      </span>
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
          <CardTitle>Faculty Module Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600">✅ Implemented:</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Complete Laravel API with CRUD operations</li>
                <li>• Department filtering and search functionality</li>
                <li>• Role-based access control (Admin only)</li>
                <li>• Soft deletes for archiving</li>
                <li>• MySQL database with relationships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">🔄 Ready to Connect:</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Add/Edit faculty forms</li>
                <li>• Department dropdown filtering</li>
                <li>• Advanced search options</li>
                <li>• Faculty profile viewing</li>
                <li>• Data export functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Faculty;
