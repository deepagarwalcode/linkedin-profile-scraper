import React from 'react';
import { Database, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmptyState: React.FC = () => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <Database size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Leads Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {isAdmin 
            ? "Upload a CSV file to analyze and manage your lead data. Get insights, filter, and compare your leads effortlessly."
            : "There are currently no leads available in the system. Please check back later or contact an administrator."}
        </p>
      </div>
      
      {isAdmin && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            {
              icon: <Upload size={24} />,
              title: 'Upload',
              description: 'Upload your CSV file with lead data including names, contacts, and match percentages'
            },
            {
              icon: <Database size={24} />,
              title: 'Analyze',
              description: 'Filter, sort, and search your leads to find the best opportunities'
            },
            {
              icon: <BarChart2 size={24} />,
              title: 'Compare',
              description: 'Select multiple leads to compare their attributes side by side'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import { BarChart2 } from 'lucide-react';