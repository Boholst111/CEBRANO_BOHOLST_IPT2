import { Request, Response } from 'express';
import { StudentModel } from '../models/Student-mysql';
import { FacultyModel } from '../models/Faculty-mysql';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// Helper function to generate PDF
const generateStudentPDF = async (students: any[], stats: any, filters: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];
            
            doc.on('data', (chunk: Buffer) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            
            // Title
            doc.fontSize(20).font('Helvetica-Bold').text('Student Report', { align: 'center' });
            doc.moveDown();
            
            // Filters
            doc.fontSize(10).font('Helvetica').text('Report Generated: ' + new Date().toLocaleString());
            if (filters.department_id) doc.text(`Department ID: ${filters.department_id}`);
            if (filters.course_id) doc.text(`Course ID: ${filters.course_id}`);
            if (filters.academic_year) doc.text(`Academic Year: ${filters.academic_year}`);
            doc.moveDown();
            
            // Statistics
            doc.fontSize(12).font('Helvetica-Bold').text('Summary Statistics');
            doc.fontSize(10).font('Helvetica')
                .text(`Total Students: ${stats.total}`)
                .moveDown();
            
            // By Department
            if (stats.byDepartment && stats.byDepartment.length > 0) {
                doc.fontSize(11).font('Helvetica-Bold').text('By Department:');
                stats.byDepartment.forEach((item: any) => {
                    doc.fontSize(10).font('Helvetica').text(`  ${item.department}: ${item.count}`);
                });
                doc.moveDown();
            }
            
            // By Course
            if (stats.byCourse && stats.byCourse.length > 0) {
                doc.fontSize(11).font('Helvetica-Bold').text('By Course:');
                stats.byCourse.forEach((item: any) => {
                    doc.fontSize(10).font('Helvetica').text(`  ${item.course}: ${item.count}`);
                });
                doc.moveDown();
            }
            
            // Student Details Table
            if (students.length > 0) {
                doc.fontSize(12).font('Helvetica-Bold').text('Student Details');
                doc.moveDown(0.3);
                
                const startY = doc.y;
                const tableTop = startY + 10;
                const col1 = 40;
                const col2 = 110;
                const col3 = 200;
                const col4 = 310;
                const col5 = 430;
                
                // Header
                doc.fontSize(9).font('Helvetica-Bold')
                    .text('ID', col1, tableTop)
                    .text('Name', col2, tableTop)
                    .text('Department', col3, tableTop)
                    .text('Course', col4, tableTop)
                    .text('Year', col5, tableTop);
                
                doc.moveTo(40, tableTop + 15).lineTo(540, tableTop + 15).stroke();
                
                let yPos = tableTop + 25;
                students.slice(0, 15).forEach((student: any) => {
                    doc.fontSize(7).font('Helvetica')
                        .text(student.id?.toString() || '', col1, yPos)
                        .text((student.user_name || student.name)?.substring(0, 12) || '', col2, yPos)
                        .text(student.department_name?.substring(0, 16) || '', col3, yPos)
                        .text(student.course_code?.substring(0, 16) || '', col4, yPos)
                        .text(student.academic_year?.substring(0, 10) || '', col5, yPos);
                    yPos += 15;
                });
            }
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

// Helper function to generate Faculty PDF
const generateFacultyPDF = async (faculty: any[], stats: any, filters: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];
            
            doc.on('data', (chunk: Buffer) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            
            // Title
            doc.fontSize(20).font('Helvetica-Bold').text('Faculty Report', { align: 'center' });
            doc.moveDown();
            
            // Filters
            doc.fontSize(10).font('Helvetica').text('Report Generated: ' + new Date().toLocaleString());
            if (filters.department_id) doc.text(`Department ID: ${filters.department_id}`);
            if (filters.employment_type) doc.text(`Employment Type: ${filters.employment_type}`);
            doc.moveDown();
            
            // Statistics
            doc.fontSize(12).font('Helvetica-Bold').text('Summary Statistics');
            doc.fontSize(10).font('Helvetica')
                .text(`Total Faculty: ${stats.total}`)
                .text(`Average Salary: ${stats.averageSalary.toLocaleString()}`)
                .moveDown();
            
            // By Department
            if (stats.byDepartment && stats.byDepartment.length > 0) {
                doc.fontSize(11).font('Helvetica-Bold').text('By Department:');
                stats.byDepartment.forEach((item: any) => {
                    doc.fontSize(10).font('Helvetica').text(`  ${item.department}: ${item.count}`);
                });
                doc.moveDown();
            }
            
            // By Employment Type
            if (stats.byEmploymentType && stats.byEmploymentType.length > 0) {
                doc.fontSize(11).font('Helvetica-Bold').text('By Employment Type:');
                stats.byEmploymentType.forEach((item: any) => {
                    doc.fontSize(10).font('Helvetica').text(`  ${item.type}: ${item.count}`);
                });
                doc.moveDown();
            }
            
            // Faculty Details Table
            if (faculty.length > 0) {
                doc.fontSize(12).font('Helvetica-Bold').text('Faculty Details');
                doc.moveDown(0.3);
                
                const startY = doc.y;
                const tableTop = startY + 10;
                const col1 = 35;
                const col2 = 85;
                const col3 = 170;
                const col4 = 290;
                const col5 = 420;
                
                // Header
                doc.fontSize(9).font('Helvetica-Bold')
                    .text('ID', col1, tableTop)
                    .text('Name', col2, tableTop)
                    .text('Department', col3, tableTop)
                    .text('Position', col4, tableTop)
                    .text('Type', col5, tableTop);
                
                doc.moveTo(35, tableTop + 15).lineTo(540, tableTop + 15).stroke();
                
                let yPos = tableTop + 25;
                faculty.slice(0, 15).forEach((member: any) => {
                    doc.fontSize(7).font('Helvetica')
                        .text(member.id?.toString() || '', col1, yPos)
                        .text((member.user_name || member.name)?.substring(0, 11) || '', col2, yPos)
                        .text(member.department_name?.substring(0, 16) || '', col3, yPos)
                        .text(member.position?.substring(0, 18) || '', col4, yPos)
                        .text(member.employment_type?.substring(0, 10) || '', col5, yPos);
                    yPos += 15;
                });
            }
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

// Helper function to generate Excel
const generateStudentExcel = async (students: any[], stats: any, filters: any): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    
    // Student Details sheet (as main sheet)
    const studentsSheet = workbook.addWorksheet('Students');
    studentsSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Course Code', key: 'course_code', width: 15 },
        { header: 'Department', key: 'department_name', width: 20 },
        { header: 'Academic Year', key: 'academic_year', width: 15 },
        { header: 'Contact', key: 'contact_number', width: 15 }
    ];
    
    students.forEach((student: any) => {
        studentsSheet.addRow({
            id: student.id,
            student_id: student.student_id,
            name: student.user_name || student.name || 'N/A',
            course_code: student.course_code,
            department_name: student.department_name,
            academic_year: student.academic_year,
            contact_number: student.phone || 'N/A'
        });
    });
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
    ];
    
    summarySheet.addRow({ metric: 'Total Students', value: stats.total });
    summarySheet.addRow({ metric: 'Report Generated', value: new Date().toLocaleString() });
    if (filters.department_id) summarySheet.addRow({ metric: 'Department ID', value: filters.department_id });
    if (filters.course_id) summarySheet.addRow({ metric: 'Course ID', value: filters.course_id });
    if (filters.academic_year) summarySheet.addRow({ metric: 'Academic Year', value: filters.academic_year });
    
    // Statistics by Department
    if (stats.byDepartment && stats.byDepartment.length > 0) {
        const deptSheet = workbook.addWorksheet('By Department');
        deptSheet.columns = [
            { header: 'Department', key: 'department', width: 30 },
            { header: 'Count', key: 'count', width: 15 }
        ];
        stats.byDepartment.forEach((item: any) => {
            deptSheet.addRow({ department: item.department, count: item.count });
        });
    }
    
    // Statistics by Course
    if (stats.byCourse && stats.byCourse.length > 0) {
        const courseSheet = workbook.addWorksheet('By Course');
        courseSheet.columns = [
            { header: 'Course Code', key: 'course', width: 20 },
            { header: 'Count', key: 'count', width: 15 }
        ];
        stats.byCourse.forEach((item: any) => {
            courseSheet.addRow({ course: item.course, count: item.count });
        });
    }
    
    return await workbook.xlsx.writeBuffer() as unknown as Buffer;
};

// Helper function to generate Faculty Excel
const generateFacultyExcel = async (faculty: any[], stats: any, filters: any): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    
    // Faculty Details sheet (as main sheet)
    const facultySheet = workbook.addWorksheet('Faculty');
    facultySheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Employee ID', key: 'employee_id', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Department', key: 'department_name', width: 20 },
        { header: 'Position', key: 'position', width: 20 },
        { header: 'Employment Type', key: 'employment_type', width: 15 },
        { header: 'Salary', key: 'salary', width: 15 }
    ];
    
    faculty.forEach((member: any) => {
        facultySheet.addRow({
            id: member.id,
            employee_id: member.employee_id,
            name: member.user_name || member.name || 'N/A',
            department_name: member.department_name,
            position: member.position,
            employment_type: member.employment_type,
            salary: member.salary
        });
    });
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
    ];
    
    summarySheet.addRow({ metric: 'Total Faculty', value: stats.total });
    summarySheet.addRow({ metric: 'Average Salary', value: stats.averageSalary });
    summarySheet.addRow({ metric: 'Report Generated', value: new Date().toLocaleString() });
    if (filters.department_id) summarySheet.addRow({ metric: 'Department ID', value: filters.department_id });
    if (filters.employment_type) summarySheet.addRow({ metric: 'Employment Type', value: filters.employment_type });
    
    // Statistics by Department
    if (stats.byDepartment && stats.byDepartment.length > 0) {
        const deptSheet = workbook.addWorksheet('By Department');
        deptSheet.columns = [
            { header: 'Department', key: 'department', width: 30 },
            { header: 'Count', key: 'count', width: 15 }
        ];
        stats.byDepartment.forEach((item: any) => {
            deptSheet.addRow({ department: item.department, count: item.count });
        });
    }
    
    // Statistics by Employment Type
    if (stats.byEmploymentType && stats.byEmploymentType.length > 0) {
        const typeSheet = workbook.addWorksheet('By Employment Type');
        typeSheet.columns = [
            { header: 'Type', key: 'type', width: 30 },
            { header: 'Count', key: 'count', width: 15 }
        ];
        stats.byEmploymentType.forEach((item: any) => {
            typeSheet.addRow({ type: item.type, count: item.count });
        });
    }
    
    return await workbook.xlsx.writeBuffer() as unknown as Buffer;
};

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
        
        console.log('ReportsController - Students from model:', {
            count: result.students.length,
            firstStudent: result.students[0],
            fields: result.students[0] ? Object.keys(result.students[0]) : [],
            sample: result.students.slice(0, 2)
        });
        
        // Filter by academic year if provided
        let students = result.students;
        if (academicYear) {
            students = students.filter(student => 
                student.academic_year_name && student.academic_year_name.includes(academicYear)
            );
        }

        // Sort students by ID
        students.sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
        
        // Generate statistics
        const stats = {
            total: students.length,
            byCourse: {} as Record<string, number>,
            byDepartment: {} as Record<string, number>,
            byAcademicYear: {} as Record<string, number>
        };
        
        // Calculate statistics
        students.forEach((student: any) => {
            // By course
            const courseName = student.course_code || 'Unknown';
            stats.byCourse[courseName] = (stats.byCourse[courseName] || 0) + 1;
            
            // By department
            const deptName = student.department_name || 'Unknown';
            stats.byDepartment[deptName] = (stats.byDepartment[deptName] || 0) + 1;
            
            // By academic year
            const year = student.academic_year_name || 'Unknown';
            stats.byAcademicYear[year] = (stats.byAcademicYear[year] || 0) + 1;
        });
        
        console.log('DEBUG - Sample students for statistics:', {
            sample1: { 
                id: students[0]?.id, 
                course_code: students[0]?.course_code,
                department_name: students[0]?.department_name,
                academic_year: students[0]?.academic_year
            },
            sample2: { 
                id: students[1]?.id, 
                course_code: students[1]?.course_code,
                department_name: students[1]?.department_name,
                academic_year: students[1]?.academic_year
            }
        });
        
        // Convert objects to arrays for frontend
        const byCourseArray = Object.entries(stats.byCourse).map(([course, count]) => ({ course, count }));
        const byDepartmentArray = Object.entries(stats.byDepartment).map(([department, count]) => ({ department, count }));
        const byAcademicYearArray = Object.entries(stats.byAcademicYear).map(([year, count]) => ({ year, count }));
        
        console.log('Statistics summary:', {
            total: stats.total,
            coursesCount: byCourseArray.length,
            departmentsCount: byDepartmentArray.length,
            yearsCount: byAcademicYearArray.length,
            courses: byCourseArray,
            departments: byDepartmentArray,
            years: byAcademicYearArray
        });
        
        const report: any = {
            success: true,
            version: '2.0', // Add version to confirm new code is running
            data: {
                students: students.slice(0, 10), // First 10 for preview
                statistics: {
                    total: stats.total,
                    byCourse: byCourseArray,
                    byDepartment: byDepartmentArray,
                    byAcademicYear: byAcademicYearArray
                },
                filters: {
                    course_id: courseId,
                    department_id: departmentId,
                    academic_year: academicYear
                }
            }
        };
        
        // If format is requested, generate file
        if (format === 'pdf' || format === 'excel') {
            try {
                const timestamp = Date.now();
                const filename = `student-report-${timestamp}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
                const uploadsDir = path.join(process.cwd(), 'uploads');
                
                // Ensure uploads directory exists
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                
                const filepath = path.join(uploadsDir, filename);
                
                let fileBuffer: Buffer;
                
                if (format === 'pdf') {
                    fileBuffer = await generateStudentPDF(students, stats, {
                        course_id: courseId,
                        department_id: departmentId,
                        academic_year: academicYear
                    });
                } else {
                    fileBuffer = await generateStudentExcel(students, stats, {
                        course_id: courseId,
                        department_id: departmentId,
                        academic_year: academicYear
                    });
                }
                
                fs.writeFileSync(filepath, fileBuffer);
                
                report.download_url = `/download/${filename}`;
                report.message = `${format.toUpperCase()} report generated successfully with ${stats.total} students`;
            } catch (fileError) {
                console.error('File generation error:', fileError);
                report.warning = 'Report preview generated but file download failed. Please try again.';
            }
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

        // Sort faculty by ID
        faculty.sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
        
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
            
            // Salary calculation - convert to number if it's a string
            if (member.salary) {
                const salary = typeof member.salary === 'string' ? parseFloat(member.salary) : member.salary;
                if (!isNaN(salary) && salary > 0) {
                    stats.totalSalary += salary;
                    salaryCount++;
                }
            }
        });
        
        stats.averageSalary = salaryCount > 0 ? stats.totalSalary / salaryCount : 0;
        
        // Convert objects to arrays for frontend
        const byDepartmentArray = Object.entries(stats.byDepartment).map(([department, count]) => ({ department, count }));
        const byEmploymentTypeArray = Object.entries(stats.byEmploymentType).map(([type, count]) => ({ type, count }));
        
        console.log('Faculty Statistics summary:', {
            total: stats.total,
            departmentsCount: byDepartmentArray.length,
            employmentTypesCount: byEmploymentTypeArray.length,
            averageSalary: stats.averageSalary,
            departments: byDepartmentArray,
            employmentTypes: byEmploymentTypeArray
        });
        
        const report: any = {
            success: true,
            data: {
                faculty: faculty.slice(0, 10), // First 10 for preview
                statistics: {
                    total: stats.total,
                    byDepartment: byDepartmentArray,
                    byEmploymentType: byEmploymentTypeArray,
                    byPosition: Object.entries(stats.byPosition).map(([position, count]) => ({ position, count })),
                    averageSalary: Math.round(stats.averageSalary)
                },
                filters: {
                    department_id: departmentId,
                    employment_type: employmentType
                }
            }
        };
        
        // If format is requested, generate file
        if (format === 'pdf' || format === 'excel') {
            try {
                const timestamp = Date.now();
                const filename = `faculty-report-${timestamp}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
                const uploadsDir = path.join(process.cwd(), 'uploads');
                
                // Ensure uploads directory exists
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                
                const filepath = path.join(uploadsDir, filename);
                
                let fileBuffer: Buffer;
                
                if (format === 'pdf') {
                    fileBuffer = await generateFacultyPDF(faculty, stats, {
                        department_id: departmentId,
                        employment_type: employmentType
                    });
                } else {
                    fileBuffer = await generateFacultyExcel(faculty, stats, {
                        department_id: departmentId,
                        employment_type: employmentType
                    });
                }
                
                fs.writeFileSync(filepath, fileBuffer);
                
                report.download_url = `/download/${filename}`;
                report.message = `${format.toUpperCase()} report generated successfully with ${stats.total} faculty members`;
            } catch (fileError) {
                console.error('File generation error:', fileError);
                report.warning = 'Report preview generated but file download failed. Please try again.';
            }
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

export const downloadReport = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        
        // Validate filename to prevent directory traversal
        if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filepath = path.join(uploadsDir, filename);
        
        // Verify file exists
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Set headers for download
        const fileExt = path.extname(filename).toLowerCase();
        if (fileExt === '.pdf') {
            res.setHeader('Content-Type', 'application/pdf');
        } else if (fileExt === '.xlsx') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Stream the file
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
        
        // Clean up file after 1 minute
        setTimeout(() => {
            fs.unlink(filepath, (err) => {
                if (err) console.error('Error deleting temp file:', err);
                else console.log(`Deleted temp file: ${filename}`);
            });
        }, 60000);
        
    } catch (error) {
        console.error('Download report error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to download report',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
