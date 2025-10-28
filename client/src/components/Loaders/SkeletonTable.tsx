import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};