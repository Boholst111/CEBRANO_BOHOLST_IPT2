import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CourseChartProps {
  data: Array<{
    course: string;
    count: number;
  }>;
  title?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(142, 71%, 45%)', // green
  'hsl(48, 96%, 53%)',  // yellow
  'hsl(262, 83%, 58%)', // purple
  'hsl(0, 84%, 60%)',   // red
  'hsl(199, 89%, 48%)', // blue
  'hsl(25, 95%, 53%)',  // orange
  'hsl(280, 100%, 70%)' // pink
];

export const CourseChart: React.FC<CourseChartProps> = ({
  data,
  title = "Course Distribution"
}) => {
  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    name: item.course || 'Unspecified',
    value: item.count,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value, name) => [`${value} students`, name]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};