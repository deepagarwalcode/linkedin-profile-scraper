import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={twMerge(
    'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all',
    className
  )}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={twMerge(
    'p-4 border-b border-gray-200 dark:border-gray-700',
    className
  )}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={twMerge(
    'text-lg font-semibold text-gray-900 dark:text-white',
    className
  )}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardProps> = ({ children, className }) => (
  <p className={twMerge(
    'text-sm text-gray-500 dark:text-gray-400 mt-1',
    className
  )}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={twMerge('p-4', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className }) => (
  <div className={twMerge(
    'p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900',
    className
  )}>
    {children}
  </div>
);