import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, User, ArrowLeft, FileText } from 'lucide-react';
import { Chat, ChatMessage } from '../../../types/client';

interface ChatViewProps {
  chat: Chat;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/client/chats"
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {chat.designer?.images?.[0] ? (
              <img
                src={chat.designer.images[0]}
                alt={chat.designer?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                {chat.designer?.name}
              </h2>
              {chat.requirement && (
                <Link
                  to={`/client/requirements/${chat.requirement.id}`}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {chat.requirement.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => {
          const isClientMessage = message.sender_id === chat.client_id;
          return (
            <div
              key={message.id}
              className={`flex ${isClientMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isClientMessage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isClientMessage ? 'text-indigo-200' : 'text-gray-500'
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
      <div className="bg-white border-t border-gray-200 px-6 py-4">
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
            disabled={!newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
