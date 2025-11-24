import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm, SignupForm } from './AuthForms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <SignupForm onSuccess={onClose} />
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              {mode === 'login' ? 'Create one now' : 'Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
