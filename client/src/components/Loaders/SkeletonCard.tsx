import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <Card className={`animate-pulse ${className}`}>
      <CardHeader className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </CardContent>
    </Card>
  );
};