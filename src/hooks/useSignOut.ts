import { useState } from 'react';
import { signOut as authSignOut } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authSignOut();
      setUser(null);
      toast.success('Signed out successfully');
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
};