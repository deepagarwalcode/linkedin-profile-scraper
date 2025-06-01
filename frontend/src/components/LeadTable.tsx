import React from 'react';
import { ArrowUp, ArrowDown, Check, ChevronRight } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { Lead, SortConfig } from '../types';
import { MatchBadge } from './MatchBadge';

export const LeadTable: React.FC = () => {
  const { 
    filteredLeads, 
    toggleLeadSelection, 
    sortConfig, 
    setSortConfig 
  } = useLeads();

  const handleSort = (key: keyof Lead) => {
    const direction = 
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }: { column: keyof Lead }) => {
    if (sortConfig.key !== column) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  if (filteredLeads.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-md">
        <p className="text-gray-500 dark:text-gray-400">No leads match your criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md shadow w-full">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span className="sr-only">Select</span>
            </th>
            {[
              { key: 'name', label: 'Name', width: 'w-[15%]' },
              { key: 'industry', label: 'Industry', width: 'w-[12%]' },
              { key: 'organization', label: 'Organization', width: 'w-[15%]' },
              { key: 'position', label: 'Position', width: 'w-[15%]' },
              { key: 'email', label: 'Email', width: 'w-[20%]' },
              { key: 'phone', label: 'Phone', width: 'w-[12%]' },
              { key: 'percentageMatch', label: 'Match %', width: 'w-[8%]' },
            ].map(({ key, label, width }) => (
              <th
                key={key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${width}`}
                onClick={() => handleSort(key as keyof Lead)}
              >
                <div className="flex items-center">
                  {label}
                  <SortIcon column={key as keyof Lead} />
                </div>
              </th>
            ))}
            <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {filteredLeads.map((lead) => (
            <tr 
              key={lead.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={lead.selected || false}
                    onChange={() => toggleLeadSelection(lead.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 dark:text-gray-300">{lead.industry}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 dark:text-gray-300">{lead.organization}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 dark:text-gray-300">{lead.position}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {lead.email}
                </a>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <a href={`tel:${lead.phone}`} className="text-sm text-gray-700 dark:text-gray-300">
                  {lead.phone}
                </a>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <MatchBadge percentage={lead.percentageMatch} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};