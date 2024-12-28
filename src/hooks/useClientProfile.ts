import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useClientProfile = () => {
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['clientProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { mutate: updateProfile, isLoading: isSaving } = useMutation({
    mutationFn: async (updates: Partial<typeof profile>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('client_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  });

  return {
    profile,
    updateProfile,
    isLoading,
    isSaving
  };
};