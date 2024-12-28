import React from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../../../types/client';

interface RecentChatsProps {
  chats: Chat[];
}

export const RecentChats: React.FC<RecentChatsProps> = ({ chats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Chats</h2>
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/client/chats/${chat.id}`}
            className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full" />
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {chat.designer?.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(chat.last_message?.created_at || '').toLocaleDateString()}
                </span>
              </div>
              {chat.last_message && (
                <p className="text-sm text-gray-600 line-clamp-1">
                  {chat.last_message.content}
                </p>
              )}
              {chat.requirement && (
                <p className="text-xs text-gray-500 mt-1">
                  Re: {chat.requirement.title}
                </p>
              )}
            </div>
          </Link>
        ))}
        {chats.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent chats</p>
        )}
      </div>
      <Link
        to="/client/chats"
        className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-4"
      >
        View All Chats
      </Link>
    </div>
  );
};