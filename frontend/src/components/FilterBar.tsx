import React, { useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, Timer } from 'lucide-react';
import { Button } from './ui/Button';
import { useLeads } from '../context/LeadContext';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

export const FilterBar: React.FC = () => {
  const { filter, updateFilter, resetFilter, uniqueIndustries, searchLeads } = useLeads();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimer, setSearchTimer] = useState(5);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ search: e.target.value });
  };
  
  const handleSearch = useCallback(async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setSearchTimer(5);
    
    const timer = setInterval(() => {
      setSearchTimer((prev) => prev - 1);
    }, 1000);

    try {
      await searchLeads();
      
      // Wait for 5 seconds before showing results
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success('Search completed successfully');
    } catch (error) {
      toast.error('Failed to search leads');
    } finally {
      clearInterval(timer);
      setIsSearching(false);
      setSearchTimer(5);
    }
  }, [searchLeads, isSearching]);
  
  const handleIndustryChange = (industry: string) => {
    const currentIndustries = [...filter.industry];
    const index = currentIndustries.indexOf(industry);
    
    if (index === -1) {
      updateFilter({ industry: [...currentIndustries, industry] });
    } else {
      currentIndustries.splice(index, 1);
      updateFilter({ industry: currentIndustries });
    }
  };
  
  const handleMinMatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ minMatch: parseInt(e.target.value) });
  };
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <div className="mb-6 space-y-4 relative">
      {isSearching && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <div className="animate-spin mb-3 h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-900 dark:text-white font-medium">
              Searching... {searchTimer}s
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name, industry, position..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={filter.search}
            onChange={handleSearchChange}
          />
          {filter.search && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => updateFilter({ search: '' })}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            icon={isSearching ? <Timer size={16} /> : <Search size={16} />}
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? `Searching (${searchTimer}s)` : 'Search'}
          </Button>
          
          <Button
            variant="outline"
            size="md"
            icon={<Filter size={16} />}
            onClick={toggleFilters}
            className={isFilterOpen ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}
          >
            Filters
            <ChevronDown size={16} className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {(filter.industry.length > 0 || filter.minMatch > 0 || filter.search) && (
            <Button
              variant="ghost"
              size="md"
              onClick={resetFilter}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div>
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Industries</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueIndustries.length > 0 ? (
                uniqueIndustries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => handleIndustryChange(industry)}
                    className={twMerge(
                      'px-3 py-1 text-xs rounded-full transition-colors',
                      filter.industry.includes(industry)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {industry}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No industries available</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Minimum Match Percentage: {filter.minMatch}%
            </h3>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filter.minMatch}
              onChange={handleMinMatchChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};