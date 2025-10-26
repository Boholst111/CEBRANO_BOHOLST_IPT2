<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Faculty Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
            border-bottom: 2px solid #28a745;
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
            background-color: #28a745;
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
    <h1>Faculty Report</h1>
    
    <div class="meta">
        <p>Generated: {{ date('Y-m-d H:i:s') }}</p>
        <p>Total Faculty: {{ count($faculty) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Employment Type</th>
                <th>Email</th>
                <th>Phone</th>
            </tr>
        </thead>
        <tbody>
            @foreach($faculty as $member)
            <tr>
                <td>{{ $member->employee_id }}</td>
                <td>{{ $member->user->name ?? 'N/A' }}</td>
                <td>{{ $member->department->name ?? 'N/A' }}</td>
                <td>{{ $member->position ?? 'N/A' }}</td>
                <td>{{ ucfirst(str_replace('_', ' ', $member->employment_type)) }}</td>
                <td>{{ $member->user->email ?? 'N/A' }}</td>
                <td>{{ $member->phone ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This is an automatically generated report. Please verify data accuracy.</p>
    </div>
</body>
</html>
