import { Request, Response } from 'express';
import { StudentModel } from '../models/Student-mysql';
import { FacultyModel } from '../models/Faculty-mysql';

export const getStudentReport = async (req: Request, res: Response) => {
    try {
        const { course_id, department_id, academic_year, format } = req.query;
        
        // Convert to numbers if provided
        const courseId = course_id ? parseInt(course_id as string) : undefined;
        const departmentId = department_id ? parseInt(department_id as string) : undefined;
        const academicYear = academic_year as string;
        
        console.log('Student report filters:', { courseId, departmentId, academicYear, format });
        
        // Get filtered students data
        const result = await StudentModel.findAll(1, 1000, undefined, departmentId, courseId);
        
        // Filter by academic year if provided
        let students = result.students;
        if (academicYear) {
            students = students.filter(student => 
                student.academic_year && student.academic_year.includes(academicYear)
            );
        }
        
        // Generate statistics
        const stats = {
            total: students.length,
            byCourse: {} as Record<string, number>,
            byDepartment: {} as Record<string, number>,
            byAcademicYear: {} as Record<string, number>
        };
        
        // Calculate statistics
        students.forEach(student => {
            // By course
            const courseName = student.course_name || 'Unknown';
            stats.byCourse[courseName] = (stats.byCourse[courseName] || 0) + 1;
            
            // By department
            const deptName = student.department_name || 'Unknown';
            stats.byDepartment[deptName] = (stats.byDepartment[deptName] || 0) + 1;
            
            // By academic year
            const year = student.academic_year || 'Unknown';
            stats.byAcademicYear[year] = (stats.byAcademicYear[year] || 0) + 1;
        });
        
        // Convert objects to arrays for frontend
        const report: any = {
            success: true,
            data: {
                students: students.slice(0, 10), // First 10 for preview
                statistics: {
                    total: stats.total,
                    byCourse: Object.entries(stats.byCourse).map(([course, count]) => ({ course, count })),
                    byDepartment: Object.entries(stats.byDepartment).map(([department, count]) => ({ department, count })),
                    byAcademicYear: Object.entries(stats.byAcademicYear).map(([year, count]) => ({ year, count }))
                },
                filters: {
                    course_id: courseId,
                    department_id: departmentId,
                    academic_year: academicYear
                }
            }
        };
        
        // If format is requested, indicate file generation
        if (format === 'pdf' || format === 'excel') {
            report.message = `${format.toUpperCase()} report would be generated with ${stats.total} students`;
            report.download_url = `#`; // Placeholder for actual file download
        }
        
        res.json(report);
        
    } catch (error) {
        console.error('Student report error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate student report',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getFacultyReport = async (req: Request, res: Response) => {
    try {
        const { department_id, employment_type, format } = req.query;
        
        // Convert to number if provided
        const departmentId = department_id ? parseInt(department_id as string) : undefined;
        const employmentType = employment_type as string;
        
        console.log('Faculty report filters:', { departmentId, employmentType, format });
        
        // Get filtered faculty data
        const result = await FacultyModel.findAll(1, 1000, undefined, departmentId);
        
        // Filter by employment type if provided
        let faculty = result.faculty;
        if (employmentType && employmentType !== 'all') {
            faculty = faculty.filter(member => 
                member.employment_type === employmentType
            );
        }
        
        // Generate statistics
        const stats = {
            total: faculty.length,
            byDepartment: {} as Record<string, number>,
            byEmploymentType: {} as Record<string, number>,
            byPosition: {} as Record<string, number>,
            totalSalary: 0,
            averageSalary: 0
        };
        
        // Calculate statistics
        let salaryCount = 0;
        faculty.forEach(member => {
            // By department
            const deptName = member.department_name || 'Unknown';
            stats.byDepartment[deptName] = (stats.byDepartment[deptName] || 0) + 1;
            
            // By employment type
            const empType = member.employment_type || 'Unknown';
            stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;
            
            // By position
            const position = member.position || 'Unknown';
            stats.byPosition[position] = (stats.byPosition[position] || 0) + 1;
            
            // Salary calculation
            if (member.salary && typeof member.salary === 'number') {
                stats.totalSalary += member.salary;
                salaryCount++;
            }
        });
        
        stats.averageSalary = salaryCount > 0 ? stats.totalSalary / salaryCount : 0;
        
        // Convert objects to arrays for frontend
        const report: any = {
            success: true,
            data: {
                faculty: faculty.slice(0, 10), // First 10 for preview
                statistics: {
                    total: stats.total,
                    byDepartment: Object.entries(stats.byDepartment).map(([department, count]) => ({ department, count })),
                    byEmploymentType: Object.entries(stats.byEmploymentType).map(([type, count]) => ({ type, count })),
                    byPosition: Object.entries(stats.byPosition).map(([position, count]) => ({ position, count })),
                    averageSalary: Math.round(stats.averageSalary)
                },
                filters: {
                    department_id: departmentId,
                    employment_type: employmentType
                }
            }
        };
        
        // If format is requested, indicate file generation
        if (format === 'pdf' || format === 'excel') {
            report.message = `${format.toUpperCase()} report would be generated with ${stats.total} faculty members`;
            report.download_url = `#`; // Placeholder for actual file download
        }
        
        res.json(report);
        
    } catch (error) {
        console.error('Faculty report error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate faculty report',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
