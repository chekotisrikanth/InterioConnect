import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { SignOutButton } from './auth/SignOutButton';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Palette className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">InteriorMatch</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/browse-designers" className="text-gray-600 hover:text-gray-900">
              Browse Designers
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/client/dashboard'}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Dashboard
                </Link>
                <SignOutButton variant="full" className="bg-gray-100 rounded-lg hover:bg-gray-200" />
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
};