import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Calendar } from 'lucide-react';
import { parseBudgetRange } from '../../../utils/budgetRange';
import { Requirement } from '../../../types/client';

interface RequestsListProps {
  requests: (Requirement & {
    client: { full_name: string; location: string };
    designer_responses: { id: string; designer_id: string }[];
  })[];
}

export const RequestsList: React.FC<RequestsListProps> = ({ requests }) => {
  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const budgetRange = parseBudgetRange(request.budget_range);
        const hasResponded = request.designer_responses.length > 0;

        return (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {request.client.location}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {request.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center text-gray-600">
                      Room Type: {request.room_type}
                    </span>
                    <span className="flex items-center text-gray-600">
                      Style: {request.preferred_style}
                    </span>
                    <span className="flex items-center text-gray-600">
                      Budget: ${budgetRange.lower.toLocaleString()} - ${budgetRange.upper.toLocaleString()}
                    </span>
                  </div>
                  {request.timeline_start && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Timeline: {new Date(request.timeline_start).toLocaleDateString()} - 
                      {request.timeline_end ? new Date(request.timeline_end).toLocaleDateString() : 'Ongoing'}
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <Link
                    to={`/designer/requests/${request.id}`}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                      hasResponded
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {hasResponded ? 'View Response' : 'Send Proposal'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {requests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No requests found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more requests
          </p>
        </div>
      )}
    </div>
  );
};