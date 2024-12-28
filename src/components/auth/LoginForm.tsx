import React, { useState } from 'react';
import { signIn } from '../../lib/auth';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { AUTH_CONFIG } from '../../lib/auth/constants';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await signIn(formData.email, formData.password);
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      setUser(user);
      toast.success('Welcome back!');
      onSuccess();

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'client':
        case 'user':
          navigate('/client/dashboard');
          break;
        case 'designer':
          navigate('/designer/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          required
          disabled={isLoading}
          minLength={6}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>

      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          onClick={() => setFormData({
            email: AUTH_CONFIG.DEFAULT_ADMIN_EMAIL,
            password: AUTH_CONFIG.DEFAULT_ADMIN_PASSWORD
          })}
          className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Fill Admin Credentials (Dev Only)
        </button>
      )}
    </form>
  );
}