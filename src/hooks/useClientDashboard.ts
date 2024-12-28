import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { DashboardStats } from '../types/client';
import { useAuthStore } from '../stores/authStore';

export const useClientDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['clientDashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get active projects count
      const { count: activeProjects } = await supabase
        .from('hired_designers')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .eq('status', 'active');

      // Get pending responses count
      const { data: requirements } = await supabase
        .from('requirements')
        .select('id')
        .eq('client_id', user.id)
        .eq('status', 'open');

      const requirementIds = requirements?.map(req => req.id) || [];
      
      const { count: pendingResponses } = await supabase
        .from('designer_responses')
        .select('*', { count: 'exact', head: true })
        .in('requirement_id', requirementIds);

      // Get unread messages count
      const { count: unreadMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
        .neq('sender_id', user.id);

      // Get recent chats
      const { data: recentChats } = await supabase
        .from('client_designer_chats')
        .select(`
          *,
          designer:designer_id (
            id,
            name,
            images
          ),
          requirement:requirement_id (
            id,
            title
          ),
          last_message:chat_messages (
            content,
            created_at
          )
        `)
        .eq('client_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(5);

      return {
        active_projects: activeProjects || 0,
        pending_responses: pendingResponses || 0,
        unread_messages: unreadMessages || 0,
        recent_chats: recentChats || []
      };
    },
    enabled: !!user?.id
  });
};