import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';
import { Chat } from '../../../types/client';

interface ChatsListProps {
  chats: Chat[];
}

export const ChatsList: React.FC<ChatsListProps> = ({ chats }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
      </div>

      {/* Chats List */}
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/client/chats/${chat.id}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 flex items-start space-x-4">
              {chat.designer?.images?.[0] ? (
                <img
                  src={chat.designer.images[0]}
                  alt={chat.designer?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {chat.designer?.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.last_message &&
                      new Date(chat.last_message.created_at).toLocaleDateString()}
                  </span>
                </div>
                {chat.last_message && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    {chat.last_message.content}
                  </p>
                )}
                {chat.requirement && (
                  <p className="mt-1 text-xs text-gray-500">
                    Re: {chat.requirement.title}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}

        {chats.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No messages yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a conversation by responding to a designer or posting a new
              requirement
            </p>
            <div className="mt-6">
              <Link
                to="/client/requirements/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Post New Requirement
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
