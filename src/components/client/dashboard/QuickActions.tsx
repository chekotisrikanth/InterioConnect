import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MessageSquare, FileText } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        to="/client/requirements/new"
        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="p-3 bg-indigo-100 rounded-lg">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">Post Requirement</h3>
          <p className="text-sm text-gray-500">Create a new design request</p>
        </div>
      </Link>

      <Link
        to="/client/requirements"
        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="p-3 bg-green-100 rounded-lg">
          <FileText className="w-6 h-6 text-green-600" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">View Responses</h3>
          <p className="text-sm text-gray-500">Check designer proposals</p>
        </div>
      </Link>

      <Link
        to="/client/chats"
        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="p-3 bg-blue-100 rounded-lg">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">Messages</h3>
          <p className="text-sm text-gray-500">Continue conversations</p>
        </div>
      </Link>
    </div>
  );
};