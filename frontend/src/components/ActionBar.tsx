import React, { useState } from 'react';
import { Download, BarChart2, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useLeads } from '../context/LeadContext';
import { exportToCSV } from '../utils/csv';
import { ComparisonModal } from './ComparisonModal';

export const ActionBar: React.FC = () => {
  const { filteredLeads, selectedLeads, clearDatabase } = useLeads();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  
  const handleExport = () => {
    exportToCSV(filteredLeads);
  };
  
  const handleCompare = () => {
    setIsComparisonOpen(true);
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Leads
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredLeads.length} leads found
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={clearDatabase}
          >
            Clear DB
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleExport}
            disabled={filteredLeads.length === 0}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<BarChart2 size={16} />}
            onClick={handleCompare}
            disabled={selectedLeads.length < 2}
          >
            Compare ({selectedLeads.length})
          </Button>
        </div>
      </div>
      
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </>
  );
};