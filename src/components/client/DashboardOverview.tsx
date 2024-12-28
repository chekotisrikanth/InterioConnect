import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats, Chat } from '../../types/client';
import { PlusCircle, MessageSquare, FileText, Clock } from 'lucide-react';

interface DashboardOverviewProps {
  stats: DashboardStats;
  clientName: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  clientName,
}) => {
  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {clientName}!
        </h1>
        <Link
          to="/client/requirements/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Post Requirement
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.active_projects}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Responses
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.pending_responses}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.unread_messages}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Chats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Chats</h2>
        <div className="space-y-4">
          {stats.recent_chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/client/chats/${chat.id}`}
              className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {chat.designer?.images[0] && (
                <img
                  src={chat.designer.images[0]}
                  alt={chat.designer?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
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
        </div>
        {stats.recent_chats.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent chats</p>
        )}
        <Link
          to="/client/chats"
          className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-4"
        >
          View All Chats
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/client/requirements"
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="font-medium text-gray-900">View Requirements</h3>
            <p className="text-sm text-gray-500 mt-1">
              Check status and designer responses
            </p>
          </div>
          <FileText className="w-6 h-6 text-gray-400" />
        </Link>

        <Link
          to="/browse-designers"
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="font-medium text-gray-900">Browse Designers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Find the perfect designer for your project
            </p>
          </div>
          <PlusCircle className="w-6 h-6 text-gray-400" />
        </Link>
      </div>
    </div>
  );
};
