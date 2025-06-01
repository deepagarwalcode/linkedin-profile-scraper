import React from 'react';
import { X } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { Button } from './ui/Button';
import { MatchBadge } from './MatchBadge';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
  const { selectedLeads, clearSelectedLeads } = useLeads();
  
  if (!isOpen) return null;
  
  const handleClose = () => {
    onClose();
  };
  
  const handleClearAll = () => {
    clearSelectedLeads();
    onClose();
  };
  
  // Fields to display in comparison
  const comparisonFields = [
    { key: 'name', label: 'Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'organization', label: 'Organization' },
    { key: 'position', label: 'Position' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'percentageMatch', label: 'Match %' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lead Comparison ({selectedLeads.length})
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-auto flex-grow">
          {selectedLeads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No leads selected for comparison. Select leads from the table to compare them.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                    Field
                  </th>
                  {selectedLeads.map((lead) => (
                    <th key={lead.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lead {lead.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {comparisonFields.map((field) => (
                  <tr key={field.key} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {field.label}
                    </td>
                    {selectedLeads.map((lead) => (
                      <td key={`${lead.id}-${field.key}`} className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {field.key === 'percentageMatch' ? (
                          <MatchBadge percentage={lead[field.key] as number} />
                        ) : (
                          lead[field.key as keyof typeof lead]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Button variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};