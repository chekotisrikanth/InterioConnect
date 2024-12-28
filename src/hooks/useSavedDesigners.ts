import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Designer } from '../types';
import toast from 'react-hot-toast';

export const useSavedDesigners = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: designers, isLoading } = useQuery<Designer[]>({
    queryKey: ['savedDesigners', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookmarked_designers')
        .select(`
          designer:designer_id (
            id,
            name,
            bio,
            images,
            rating
          )
        `)
        .eq('client_id', user.id);

      if (error) throw error;
      return data.map(item => item.designer);
    },
    enabled: !!user?.id
  });

  const { mutate: removeDesigner } = useMutation({
    mutationFn: async (designerId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('bookmarked_designers')
        .delete()
        .eq('client_id', user.id)
        .eq('designer_id', designerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['savedDesigners', user?.id]);
      toast.success('Designer removed from saved list');
    },
    onError: (error: any) => {
      console.error('Error removing designer:', error);
      toast.error(error.message || 'Failed to remove designer');
    }
  });

  return {
    designers,
    removeDesigner,
    isLoading
  };
};