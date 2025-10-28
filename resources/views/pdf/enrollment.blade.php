<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Enrollment Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .meta {
            text-align: right;
            color: #666;
            margin-bottom: 20px;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
        }
        th {
            background-color: #007bff;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
        }
        td {
            padding: 6px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Course Enrollment Report</h1>
    
    <div class="meta">
        <p>Generated: {{ date('Y-m-d H:i:s') }}</p>
        <p>Total Enrollments: {{ count($enrollments) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($enrollments as $enrollment)
            <tr>
                <td>{{ $enrollment->course->code ?? 'N/A' }}</td>
                <td>{{ $enrollment->course->name ?? 'N/A' }}</td>
                <td>{{ $enrollment->course->department->name ?? 'N/A' }}</td>
                <td>{{ $enrollment->course->credits ?? 'N/A' }}</td>
                <td>{{ $enrollment->academicYear->name ?? 'N/A' }}</td>
                <td>{{ $enrollment->user->name ?? 'N/A' }}</td>
                <td>Not Graded</td>
                <td>Enrolled</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This is an automatically generated report. Please verify data accuracy.</p>
    </div>
</body>
</html>
