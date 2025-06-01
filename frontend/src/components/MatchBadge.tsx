import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ 
  percentage, 
  size = 'md' 
}) => {
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (percentage >= 60) return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
    if (percentage >= 40) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (percentage >= 20) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  return (
    <span className={twMerge(
      'inline-flex items-center rounded-full font-medium',
      getColorClass(),
      sizeClasses[size]
    )}>
      {percentage}%
    </span>
  );
};