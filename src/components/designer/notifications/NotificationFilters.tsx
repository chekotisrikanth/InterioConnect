import React from 'react';

interface NotificationFiltersProps {
  filters: {
    type: string;
    read: string;
    timeframe: string;
  };
  onChange: (filters: any) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Type</h3>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="message">Messages</option>
            <option value="requirement">Requirements</option>
            <option value="update">Updates</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
          <select
            value={filters.read}
            onChange={(e) => onChange({ ...filters, read: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Time Frame</h3>
          <select
            value={filters.timeframe}
            onChange={(e) => onChange({ ...filters, timeframe: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="">All Time</option>
          </select>
        </div>

        <button
          onClick={() =>
            onChange({
              type: '',
              read: '',
              timeframe: '7days'
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