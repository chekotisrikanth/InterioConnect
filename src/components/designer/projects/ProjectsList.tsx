import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { parseBudgetRange } from '../../../utils/budgetRange';

interface Project {
  id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  client: {
    full_name: string;
    location: string;
  };
  requirement: {
    title: string;
    description: string;
    room_type: string;
    preferred_style: string;
    budget_range: string;
    timeline_start: string;
    timeline_end: string | null;
    images: string[];
  };
}

interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      {projects.map((project) => {
        const budgetRange = parseBudgetRange(project.requirement.budget_range);
        const isCompleted = project.status === 'completed';

        return (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.requirement.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.client.full_name} • {project.client.location}
                  </div>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {project.requirement.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center text-gray-600">
                      Room Type: {project.requirement.room_type}
                    </span>
                    <span className="flex items-center text-gray-600">
                      Style: {project.requirement.preferred_style}
                    </span>
                    <span className="flex items-center text-gray-600">
                      Budget: ${budgetRange.lower.toLocaleString()} - ${budgetRange.upper.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Timeline: {new Date(project.start_date).toLocaleDateString()} - 
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                  </div>
                </div>

                <div className="ml-6">
                  <Link
                    to={`/designer/projects/${project.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Projects you take on will appear here
          </p>
        </div>
      )}
    </div>
  );
};