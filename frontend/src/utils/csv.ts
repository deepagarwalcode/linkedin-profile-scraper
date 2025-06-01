import Papa from 'papaparse';
import { Lead } from '../types';

export const parseCSV = (file: File): Promise<Lead[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const leads: Lead[] = results.data.map((row: any) => ({
            name: row.Name || '',
            industry: row.Industry || '',
            organization: row.Organization || '',
            position: row.Position || '',
            email: row.Email || '',
            phone: row.Phone || '',
            percentageMatch: parseInt(row['Percentage Match']) || 0
          }));
          resolve(leads);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const exportToCSV = (leads: Lead[]): void => {
  const csv = Papa.unparse(leads.map(lead => ({
    Name: lead.name,
    Industry: lead.industry,
    Organization: lead.organization,
    Position: lead.position,
    Email: lead.email,
    Phone: lead.phone,
    'Percentage Match': `${lead.percentageMatch}%`
  })));
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};