import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardOverview } from '../../components/client/DashboardOverview';
import { DashboardStats } from '../../types/client';
import { supabase } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  // Fetch client profile and stats
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['clientDashboardStats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get active projects count
      const { count: activeProjects } = await supabase
        .from('hired_designers')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .eq('status', 'active');

      // Get open requirements and their responses
      const { data: openRequirements } = await supabase
        .from('requirements')
        .select('id')
        .eq('client_id', user.id)
        .eq('status', 'open');

      const requirementIds = openRequirements?.map(req => req.id) || [];
      
      const { count: pendingResponses } = await supabase
        .from('designer_responses')
        .select('*', { count: 'exact', head: true })
        .in('requirement_id', requirementIds);

      // Get chats and unread messages
      const { data: clientChats } = await supabase
        .from('client_designer_chats')
        .select('id')
        .eq('client_id', user.id);

      const chatIds = clientChats?.map(chat => chat.id) || [];
      
      const { count: unreadMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .in('chat_id', chatIds)
        .neq('sender_id', user.id)
        .eq('read', false);

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
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['clientProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!stats || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return <DashboardOverview stats={stats} clientName={profile.full_name} />;
};
