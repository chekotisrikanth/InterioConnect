import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  FileText,
  CheckCircle,
  MapPin,
  Calendar,
  DollarSign,
  MessageSquare,
  User,
} from 'lucide-react';
import {
  Requirement,
  DesignerResponse,
  RequirementStatus,
} from '../../../types/client';

interface RequirementDetailsProps {
  requirement: Requirement;
  designerResponses: DesignerResponse[];
  onStartChat: (designerId: string) => void;
  onHireDesigner: (designerId: string) => void;
}

const statusColors: Record<RequirementStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
};

const statusIcons = {
  open: Clock,
  in_progress: FileText,
  closed: CheckCircle,
};

export const RequirementDetails: React.FC<RequirementDetailsProps> = ({
  requirement,
  designerResponses,
  onStartChat,
  onHireDesigner,
}) => {
  const StatusIcon = statusIcons[requirement.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <Link
              to="/client/requirements"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Requirements
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            {requirement.title}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[requirement.status]
              }`}
            >
              <StatusIcon className="w-4 h-4 mr-1" />
              {requirement.status.charAt(0).toUpperCase() +
                requirement.status.slice(1)}
            </span>
            {requirement.location && (
              <span className="inline-flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {requirement.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Requirement Details */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-900">{requirement.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Room Type</h3>
                  <p className="mt-1 text-gray-900">{requirement.room_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Style</h3>
                  <p className="mt-1 text-gray-900">
                    {requirement.preferred_style}
                  </p>
                </div>
              </div>
              {requirement.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Reference Images
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {requirement.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Reference ${index + 1}`}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Designer Responses */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Designer Responses ({designerResponses.length})
            </h2>
            <div className="space-y-6">
              {designerResponses.map((response) => (
                <div
                  key={response.id}
                  className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {response.designer?.images?.[0] ? (
                        <img
                          src={response.designer.images[0]}
                          alt={response.designer?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {response.designer?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Responded{' '}
                          {new Date(response.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onStartChat(response.designer_id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        Chat
                      </button>
                      {requirement.status === 'open' && (
                        <button
                          onClick={() => onHireDesigner(response.designer_id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Hire Designer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-gray-600">{response.proposal}</p>
                    <div className="flex space-x-6">
                      {response.estimated_cost && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Estimated Cost: $
                          {response.estimated_cost.toLocaleString()}
                        </div>
                      )}
                      {response.estimated_timeline && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          Timeline: {response.estimated_timeline} days
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {designerResponses.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    No designers have responded yet. Check back later!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Budget Range
                </h3>
                <p className="mt-1 text-gray-900">
                  ${requirement.budget_range.lower.toLocaleString()} - $
                  {requirement.budget_range.upper.toLocaleString()}
                </p>
              </div>
              {requirement.timeline_start && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(requirement.timeline_start).toLocaleDateString()} -{' '}
                    {requirement.timeline_end
                      ? new Date(requirement.timeline_end).toLocaleDateString()
                      : 'Ongoing'}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Visibility</h3>
                <p className="mt-1 text-gray-900">
                  {requirement.visibility
                    ? 'Visible to all designers'
                    : 'Limited visibility'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
