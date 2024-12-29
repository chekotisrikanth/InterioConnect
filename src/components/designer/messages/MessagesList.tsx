import React from 'react';
import { MessageSquare, User, Calendar } from 'lucide-react';

interface Chat {
  id: string;
  client: {
    full_name: string;
    location: string;
  };
  requirement?: {
    title: string;
    room_type: string;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  }[];
}

interface MessagesListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 ${
              selectedChatId === chat.id ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {chat.client.full_name}
                  </p>
                  {chat.last_message?.[0] && (
                    <span className="text-xs text-gray-500">
                      {new Date(chat.last_message[0].created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {chat.requirement && (
                  <p className="text-xs text-gray-500 mt-1">
                    Re: {chat.requirement.title}
                  </p>
                )}
                {chat.last_message?.[0] && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {chat.last_message[0].content}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No messages yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Messages from clients will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};