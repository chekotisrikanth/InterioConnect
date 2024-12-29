import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { QuickStats } from '../../components/designer/dashboard/QuickStats';
import { NewRequests } from '../../components/designer/dashboard/NewRequests';
import { ActiveProjects } from '../../components/designer/dashboard/ActiveProjects';
import { RecentMessages } from '../../components/designer/dashboard/RecentMessages';

export const DashboardOverview: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Requests */}
        <NewRequests />
        
        {/* Active Projects */}
        <ActiveProjects />
      </div>

      {/* Recent Messages */}
      <RecentMessages />
    </div>
  );
};