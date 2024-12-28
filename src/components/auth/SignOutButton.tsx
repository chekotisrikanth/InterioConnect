import React from 'react';
import { LogOut } from 'lucide-react';
import { useSignOut } from '../../hooks/useSignOut';

interface SignOutButtonProps {
  className?: string;
  variant?: 'icon' | 'text' | 'full';
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ 
  className = '', 
  variant = 'full' 
}) => {
  const { signOut, isLoading } = useSignOut();

  const baseStyles = "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    icon: "p-2 text-gray-600 hover:text-gray-900",
    text: "text-gray-600 hover:text-gray-900",
    full: "px-4 py-2 text-gray-600 hover:text-gray-900"
  };

  return (
    <button
      onClick={signOut}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <LogOut className={variant === 'icon' ? 'w-5 h-5' : 'w-5 h-5 mr-2'} />
      {variant !== 'icon' && (isLoading ? 'Signing out...' : 'Sign out')}
    </button>
  );
};