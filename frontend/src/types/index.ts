export interface Lead {
  id: string;
  name: string;
  industry: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  percentageMatch: number;
  selected?: boolean;
}

export interface LeadFilter {
  search: string;
  industry: string[];
  minMatch: number;
}

export interface SortConfig {
  key: keyof Lead | '';
  direction: 'asc' | 'desc';
}

export type ThemeMode = 'light' | 'dark';