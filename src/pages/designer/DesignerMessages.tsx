import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Loader2 } from 'lucide-react';

export const DesignerMessages: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['designerMessages', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('designer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
      {/* Add messages UI here */}
    </div>
  );
};