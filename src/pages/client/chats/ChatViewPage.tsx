import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Chat, ChatMessage } from '../../../types/client';
import { ChatView } from '../../../components/client/chats/ChatView';

export const ChatViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        // Fetch chat details
        const { data: chatData, error: chatError } = await supabase
          .from('client_designer_chats')
          .select(`
            *,
            designer:designer_id (
              id,
              name:profiles!inner(name),
              images:portfolio_images(image_url)
            ),
            requirement:requirement_id (*)
          `)
          .eq('id', id)
          .single();

        if (chatError) throw chatError;
        if (!chatData) throw new Error('Chat not found');

        // Transform the chat data
        const transformedChat = {
          ...chatData,
          designer: chatData.designer ? {
            ...chatData.designer,
            images: chatData.designer.images.map((img: { image_url: string }) => img.image_url)
          } : undefined
        };

        setChat(transformedChat);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        setMessages(messagesData || []);
      } catch (err) {
        console.error('Error fetching chat details:', err);
        setError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChatDetails();
    }

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${id}`,
        },
        (payload) => {
          // Add new message to the list
          setMessages((current) => [...current, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const handleSendMessage = async (content: string) => {
    if (!chat) return;

    try {
      const { error: sendError } = await supabase.from('chat_messages').insert({
        chat_id: chat.id,
        sender_id: chat.client_id,
        content,
      });

      if (sendError) throw sendError;

      // Update chat's updated_at timestamp
      await supabase
        .from('client_designer_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chat.id);
    } catch (err) {
      console.error('Error sending message:', err);
      // Show error toast or message
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Chat not found'}</p>
        <button
          onClick={() => navigate('/client/chats')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Chats
        </button>
      </div>
    );
  }

  return (
    <ChatView
      chat={chat}
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
};
