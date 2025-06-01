import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { FileUpload } from './components/FileUpload';
import { FilterBar } from './components/FilterBar';
import { LeadTable } from './components/LeadTable';
import { ActionBar } from './components/ActionBar';
import { EmptyState } from './components/EmptyState';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Card, CardContent } from './components/ui/Card';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider, useLeads } from './context/LeadContext';

const UnauthenticatedState: React.FC<{ onAuthClick: () => void }> = ({ onAuthClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to LeadInsight
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Please sign in to view and manage your leads.
        </p>
        <button
          onClick={onAuthClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC<{ onAuthClick: () => void }> = ({ onAuthClick }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <UnauthenticatedState onAuthClick={onAuthClick} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isAdmin && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <FileUpload />
          </CardContent>
        </Card>
      )}
      
      <Dashboard />
      
      <div className="mt-8">
        <ActionBar />
        <FilterBar />
        <LeadTable />
      </div>
    </div>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LeadProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
            <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
            <MainContent onAuthClick={() => setIsAuthModalOpen(true)} />
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '8px',
                  background: 'var(--toaster-bg, #fff)',
                  color: 'var(--toaster-color, #333)',
                },
              }}
            />
          </div>
        </LeadProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;