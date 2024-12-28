import React from 'react';
import { DashboardStats } from '../../../types/client';
import { Users, MessageSquare, FileText } from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Active Projects',
      value: stats.active_projects,
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Pending Responses',
      value: stats.pending_responses,
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Unread Messages',
      value: stats.unread_messages,
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};