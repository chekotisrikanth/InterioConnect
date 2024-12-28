import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Chat } from '../../../types/client';
import { ChatsList } from '../../../components/client/chats/ChatsList';

export const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: chatsData, error: chatsError } = await supabase
          .from('client_designer_chats')
          .select(`
            *,
            designer:designer_id (
              id,
              name:profiles!inner(name),
              images:portfolio_images(image_url)
            ),
            requirement:requirement_id (*),
            last_message:chat_messages (
              id,
              content,
              created_at
            )
          `)
          .order('updated_at', { ascending: false });

        if (chatsError) throw chatsError;

        // Transform the data to match our types
        const transformedChats = chatsData?.map(chat => ({
          ...chat,
          designer: chat.designer ? {
            ...chat.designer,
            images: chat.designer.images.map((img: { image_url: string }) => img.image_url)
          } : undefined,
          last_message: chat.last_message?.[0] // Get the first message since we're selecting all messages
        }));

        setChats(transformedChats || []);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Subscribe to new messages
    const subscription = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          // Refresh chats when new message is received
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <ChatsList chats={chats} />;
};
