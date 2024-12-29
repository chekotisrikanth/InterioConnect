import React from 'react';
import { ROOM_TYPES } from '../../../constants';

interface ProjectFiltersProps {
  filters: {
    status: string;
    roomType: string;
    sortBy: string;
  };
  onChange: (filters: any) => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Room Type</h3>
          <select
            value={filters.roomType}
            onChange={(e) => onChange({ ...filters, roomType: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <button
          onClick={() =>
            onChange({
              status: '',
              roomType: '',
              sortBy: 'newest',
            })
          }
          className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};