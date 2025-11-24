import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import ProjectCreate from './pages/ProjectCreate';
import ProjectEditor from './pages/ProjectEditor';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'create' | 'editor'>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      setCurrentPage('dashboard');
      setAuthModalOpen(true);
    } else if (!authLoading && user) {
      setAuthModalOpen(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation onAuthClick={() => setAuthModalOpen(true)} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">WebBuilder</h1>
            <p className="text-xl text-gray-600 mb-8">
              Create beautiful, fully-functional websites without writing code. Choose from pre-built templates,
              customize them to your needs, and export your site in minutes.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Now
            </button>
          </div>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Navigation
        onAuthClick={() => setAuthModalOpen(true)}
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'dashboard') setCurrentPage('dashboard');
        }}
      />

      {currentPage === 'dashboard' && (
        <Dashboard
          onProjectSelect={(projectId) => {
            setSelectedProjectId(projectId);
            setCurrentPage('editor');
          }}
          onCreateClick={() => setCurrentPage('create')}
        />
      )}

      {currentPage === 'create' && (
        <ProjectCreate
          onSuccess={(projectId) => {
            setSelectedProjectId(projectId);
            setCurrentPage('editor');
          }}
          onCancel={() => setCurrentPage('dashboard')}
        />
      )}

      {currentPage === 'editor' && (
        <ProjectEditor
          projectId={selectedProjectId}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
