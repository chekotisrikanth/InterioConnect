import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

export const RecentMessages: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['recentMessages', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          chat:chat_id (
            client:client_id (
              full_name
            ),
            requirement:requirement_id (
              title
            )
          )
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
        <Link
          to="/designer/messages"
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {message.chat?.client?.full_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {message.content}
              </p>
              {message.chat?.requirement?.title && (
                <p className="text-xs text-gray-400 mt-1">
                  Re: {message.chat.requirement.title}
                </p>
              )}
            </div>
            <Link
              to={`/designer/messages/${message.chat_id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View Chat
            </Link>
          </div>
        ))}

        {messages?.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No recent messages
          </p>
        )}
      </div>
    </div>
  );
};