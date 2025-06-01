import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { parseCSV } from '../utils/csv';
import { useLeads } from '../context/LeadContext';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

export const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLeads } = useLeads();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    const { data: userData, error: userError } = await supabase
      .schema('auth')
      .from('users')
      .select('raw_user_meta_data')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.raw_user_meta_data?.is_admin) {
      toast.error('Admin access required to upload leads');
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const parsedData = await parseCSV(file);
      setLeads(parsedData);
      toast.success(`Successfully loaded ${parsedData.length} leads`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process the CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={twMerge(
        'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
        isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-700',
        fileName && !isDragging ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {fileName ? (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <FileText size={24} />
            <span className="font-medium">{fileName}</span>
          </div>
        ) : (
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
            <Upload size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
        )}
        
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {fileName ? 'CSV File Uploaded' : 'Upload CSV File'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fileName
              ? 'File has been uploaded. You can upload another file to replace it.'
              : 'Drag and drop your CSV file here, or click to browse'}
          </p>
        </div>
        
        {!fileName && (
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            <span>CSV file should include Name, Industry, Organization, Position, Email, Phone, and Percentage Match</span>
          </div>
        )}
        
        <Button
          onClick={handleButtonClick}
          variant={fileName ? 'secondary' : 'primary'}
          isLoading={isLoading}
          icon={fileName ? <FileText size={16} /> : <Upload size={16} />}
        >
          {fileName ? 'Upload Another File' : 'Select CSV File'}
        </Button>
      </div>
    </div>
  );
};