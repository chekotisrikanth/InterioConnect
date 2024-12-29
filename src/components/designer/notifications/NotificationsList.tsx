import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { MessageSquare, FileText, Bell, Info, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationsListProps {
  filters: {
    type: string;
    read: string;
    timeframe: string;
  };
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ filters }) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['designerNotifications', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      let query = supabase
        .from('designer_notifications')
        .select('*')
        .eq('designer_id', user.id)
        .order('created_at', { ascending: false });

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.read === 'read') {
        query = query.eq('read', true);
      } else if (filters.read === 'unread') {
        query = query.eq('read', false);
      }

      if (filters.timeframe) {
        const date = new Date();
        if (filters.timeframe === '24h') {
          date.setHours(date.getHours() - 24);
        } else if (filters.timeframe === '7days') {
          date.setDate(date.getDate() - 7);
        } else if (filters.timeframe === '30days') {
          date.setDate(date.getDate() - 30);
        }
        query = query.gte('created_at', date.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('designer_notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['designerNotifications']);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const notificationIcons = {
    message: MessageSquare,
    requirement: FileText,
    update: Info,
    system: Bell
  };

  const notificationColors = {
    message: 'bg-blue-100 text-blue-600',
    requirement: 'bg-green-100 text-green-600',
    update: 'bg-yellow-100 text-yellow-600',
    system: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="space-y-4">
      {notifications?.map((notification) => {
        const Icon = notificationIcons[notification.type as keyof typeof notificationIcons];
        const colorClass = notificationColors[notification.type as keyof typeof notificationColors];

        return (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 flex items-start space-x-4 ${
              !notification.read ? 'border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead.mutate(notification.id)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              {notification.action_url && (
                <Link
                  to={notification.action_url}
                  className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  View Details
                  <FileText className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {(!notifications || notifications.length === 0) && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No notifications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      )}
    </div>
  );
};