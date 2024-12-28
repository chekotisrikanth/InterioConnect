import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface PrivacySettings {
  requirement_visibility: boolean;
  allow_messages: boolean;
  profile_visibility: boolean;
}

export const usePrivacySettings = () => {
  const user = useAuthStore((state) => state.user);

  const { data: settings, isLoading } = useQuery<PrivacySettings>({
    queryKey: ['privacySettings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('client_profiles')
        .select('requirement_visibility, allow_messages, profile_visibility')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { mutate: updateSettings, isLoading: isSaving } = useMutation({
    mutationFn: async (updates: PrivacySettings) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('client_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Privacy settings updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating privacy settings:', error);
      toast.error(error.message || 'Failed to update privacy settings');
    }
  });

  return {
    settings,
    updateSettings,
    isLoading,
    isSaving
  };
};