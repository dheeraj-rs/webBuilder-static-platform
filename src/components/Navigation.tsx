import { useAuth } from '../contexts/AuthContext';
import { Layout, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  onAuthClick: () => void;
  currentPage?: 'dashboard' | 'editor';
  onNavigate?: (page: string) => void;
}

export default function Navigation({ onAuthClick, currentPage = 'dashboard', onNavigate }: NavigationProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('dashboard')}>
            <Layout className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">WebBuilder</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <span className="text-gray-600 text-sm">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            {user && (
              <>
                <p className="text-gray-600 px-4">{user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={onAuthClick}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
