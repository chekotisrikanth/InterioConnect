import React from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { HiredDesigner } from '../../../types/client';

interface HiredDesignersListProps {
  designers: HiredDesigner[];
}

export const HiredDesignersList: React.FC<HiredDesignersListProps> = ({
  designers,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Hired Designers</h1>
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {designers
            .filter((d) => d.status === 'active')
            .map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-lg shadow-sm p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {designer.designer.images?.[0] ? (
                      <img
                        src={designer.designer.images[0]}
                        alt={designer.designer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {designer.designer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Started{' '}
                        {new Date(designer.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/client/chats/${designer.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Chat
                  </Link>
                </div>

                <div>
                  <Link
                    to={`/client/requirements/${designer.requirement.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {designer.requirement.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {designer.requirement.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {designer.end_date
                      ? `Due ${new Date(designer.end_date).toLocaleDateString()}`
                      : 'No end date set'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Completed Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Completed Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {designers
            .filter((d) => d.status === 'completed')
            .map((designer) => (
              <div
                key={designer.id}
                className="bg-white rounded-lg shadow-sm p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {designer.designer.images?.[0] ? (
                      <img
                        src={designer.designer.images[0]}
                        alt={designer.designer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {designer.designer.name}
                      </h3>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed{' '}
                        {designer.end_date &&
                          new Date(designer.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    to={`/client/requirements/${designer.requirement.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {designer.requirement.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {designer.requirement.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {`${new Date(
                      designer.start_date
                    ).toLocaleDateString()} - ${new Date(
                      designer.end_date!
                    ).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {designers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hired designers
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by browsing designers or posting a requirement
          </p>
          <div className="mt-6">
            <Link
              to="/browse-designers"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Designers
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
