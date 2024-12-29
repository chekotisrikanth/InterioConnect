import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { Send, User, FileText } from 'lucide-react';

interface ChatViewProps {
  chatId: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ chatId }) => {
  const user = useAuthStore((state) => state.user);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: chat } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_designer_chats')
        .select(`
          *,
          client:client_id (
            full_name,
            location
          ),
          requirement:requirement_id (
            title,
            room_type
          )
        `)
        .eq('id', chatId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!chatId
  });

  const { data: messages } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!chatId
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user?.id,
          content
        });

      if (error) throw error;

      // Update chat's updated_at timestamp
      await supabase
        .from('client_designer_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chatMessages', chatId]);
      setNewMessage('');
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage.mutate(newMessage.trim());
    }
  };

  if (!chat) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {chat.client.full_name}
              </h3>
              {chat.requirement && (
                <p className="text-xs text-gray-500 flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  {chat.requirement.title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => {
          const isOwnMessage = message.sender_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendMessage.isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};