import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Requirement, RequirementStatus } from '../../../types/client';
import { parseBudgetRange } from '../../../utils/budgetRange';

interface RequirementsListProps {
  requirements: Requirement[];
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
};

const statusIcons = {
  open: Clock,
  in_progress: FileText,
  closed: CheckCircle,
};

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
}) => {
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | 'all'>(
    'all'
  );

  const filteredRequirements = requirements.filter(
    (req) => statusFilter === 'all' || req.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Requirements</h1>
        <Link
          to="/client/requirements/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Post New Requirement
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'open', 'in_progress', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as RequirementStatus | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              statusFilter === status
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map((requirement) => {
          const StatusIcon = statusIcons[requirement.status];
          const budgetRange = parseBudgetRange(requirement.budget_range);

          return (
            <Link
              key={requirement.id}
              to={`/client/requirements/${requirement.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {requirement.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[requirement.status]
                        }`}
                      >
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {requirement.status.charAt(0).toUpperCase() +
                          requirement.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {requirement.room_type} • {requirement.preferred_style} •{' '}
                      {requirement.location}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {requirement.description}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col items-end">
                    <p className="text-sm font-medium text-gray-900">
                      Budget Range
                    </p>
                    <p className="text-sm text-gray-500">
                      ${budgetRange.lower.toLocaleString()} - $
                      {budgetRange.upper.toLocaleString()}
                    </p>
                    {requirement.timeline_start && (
                      <p className="mt-2 text-xs text-gray-500">
                        Timeline:{' '}
                        {new Date(
                          requirement.timeline_start
                        ).toLocaleDateString()}{' '}
                        -{' '}
                        {requirement.timeline_end
                          ? new Date(
                              requirement.timeline_end
                            ).toLocaleDateString()
                          : 'Ongoing'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No requirements found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'all'
                ? "You haven't posted any requirements yet"
                : `You don't have any ${statusFilter} requirements`}
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