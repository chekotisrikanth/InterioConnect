import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { MessageSquare, FileText, Bell, AlertCircle } from 'lucide-react';

export const NotificationStats: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ['notificationStats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: notifications } = await supabase
        .from('designer_notifications')
        .select('type, read')
        .eq('designer_id', user.id);

      const unreadCount = notifications?.filter(n => !n.read).length || 0;
      const messageCount = notifications?.filter(n => n.type === 'message').length || 0;
      const requirementCount = notifications?.filter(n => n.type === 'requirement').length || 0;
      const updateCount = notifications?.filter(n => n.type === 'update').length || 0;

      return {
        unreadCount,
        messageCount,
        requirementCount,
        updateCount
      };
    },
    enabled: !!user?.id
  });

  const statCards = [
    {
      title: 'Unread Notifications',
      value: stats?.unreadCount || 0,
      icon: Bell,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'New Messages',
      value: stats?.messageCount || 0,
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'New Requirements',
      value: stats?.requirementCount || 0,
      icon: FileText,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'System Updates',
      value: stats?.updateCount || 0,
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};