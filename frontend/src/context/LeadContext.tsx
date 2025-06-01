import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Lead, LeadFilter, SortConfig } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface LeadContextType {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLeads: Lead[];
  filter: LeadFilter;
  sortConfig: SortConfig;
  setLeads: (leads: Lead[]) => void;
  updateFilter: (filter: Partial<LeadFilter>) => void;
  resetFilter: () => void;
  toggleLeadSelection: (id: string) => void;
  clearSelectedLeads: () => void;
  setSortConfig: (config: SortConfig) => void;
  uniqueIndustries: string[];
  searchLeads: () => Promise<void>;
}

const defaultFilter: LeadFilter = {
  search: '',
  industry: [],
  minMatch: 0,
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadFilter>(defaultFilter);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const { user } = useAuth();
  
  const uniqueIndustries = Array.from(new Set(leads.map(lead => lead.industry)))
    .filter(Boolean)
    .sort();

  // Don't load leads initially, wait for search
  useEffect(() => {
    if (!user) {
      setLeads([]);
    }
  }, [user]);

  const searchLeads = useCallback(async () => {
    if (!user) {
      setLeads([]);
      return;
    }

    try {
      let query = supabase
        .from('leads')
        .select('*');

      if (filter.search) {
        query = query.or(`name.ilike.%${filter.search}%,industry.ilike.%${filter.search}%,position.ilike.%${filter.search}%`);
      }

      if (filter.industry.length > 0) {
        query = query.in('industry', filter.industry);
      }

      if (filter.minMatch > 0) {
        query = query.gte('percentage_match', filter.minMatch);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLeads((data || []).map(lead => ({
        id: lead.id,
        name: lead.name,
        industry: lead.industry,
        organization: lead.organization,
        position: lead.position,
        email: lead.email,
        phone: lead.phone,
        percentageMatch: lead.percentage_match,
        selected: false
      })));
    } catch (error) {
      console.error('Error searching leads:', error);
      throw error;
    }
  }, [filter, user]);

  const filteredLeads = leads;

  const updateFilter = useCallback((newFilterValues: Partial<LeadFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilterValues }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setLeads([]); // Clear leads when filters are reset
  }, []);

  const toggleLeadSelection = useCallback((id: string) => {
    setLeads(prevLeads => {
      const updatedLeads = prevLeads.map(lead => 
        lead.id === id ? { ...lead, selected: !lead.selected } : lead
      );
      setSelectedLeads(updatedLeads.filter(lead => lead.selected));
      return updatedLeads;
    });
  }, []);

  const clearSelectedLeads = useCallback(() => {
    setLeads(prevLeads => {
      const updatedLeads = prevLeads.map(lead => ({ ...lead, selected: false }));
      setSelectedLeads([]);
      return updatedLeads;
    });
  }, []);

  return (
    <LeadContext.Provider 
      value={{
        leads,
        filteredLeads,
        selectedLeads,
        filter,
        sortConfig,
        setLeads,
        updateFilter,
        resetFilter,
        toggleLeadSelection,
        clearSelectedLeads,
        setSortConfig,
        uniqueIndustries,
        searchLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};