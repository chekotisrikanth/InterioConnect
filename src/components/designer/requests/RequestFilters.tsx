import React from 'react';
import { ROOM_TYPES, DESIGNER_STYLES } from '../../../constants';

interface RequestFiltersProps {
  filters: {
    roomType: string;
    style: string;
    budgetMin: number;
    budgetMax: number;
  };
  onChange: (filters: any) => void;
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
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
          <h3 className="text-sm font-medium text-gray-900 mb-3">Style</h3>
          <select
            value={filters.style}
            onChange={(e) => onChange({ ...filters, style: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Styles</option>
            {DESIGNER_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Budget Range</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min Budget"
              value={filters.budgetMin || ''}
              onChange={(e) =>
                onChange({ ...filters, budgetMin: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Budget"
              value={filters.budgetMax || ''}
              onChange={(e) =>
                onChange({ ...filters, budgetMax: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={() =>
            onChange({
              roomType: '',
              style: '',
              budgetMin: 0,
              budgetMax: 0,
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