import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-spin">
        <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-950"></div>
      </div>
    </div>
  );
};

// Alternative spinner with ring animation
export const RingSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div
      className={`inline-block rounded-full border-gray-300 border-t-indigo-500 animate-spin ${sizeClasses[size]} ${className}`}
    ></div>
  );
};