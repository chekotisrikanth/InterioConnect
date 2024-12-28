import React, { useState } from 'react';
import { UserRole } from '../../types/auth';
import { signUp } from '../../lib/auth';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    certifications: '',
    services: {
      fullRoomDesign: false,
      consultation: false,
      eDesign: false
    },
    pricing: {
      type: 'fixed',
      rate: 0
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, role, formData);
      toast.success(
        role === 'designer'
          ? 'Registration successful! Please check your email for verification and wait for admin approval.'
          : 'Registration successful! Please check your email for verification.'
      );
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same as before
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing JSX */}
    </form>
  );
}