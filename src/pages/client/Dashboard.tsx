import React from 'react';
import { useClientDashboard } from '../../hooks/useClientDashboard';
import { QuickActions } from '../../components/client/dashboard/QuickActions';
import { StatsOverview } from '../../components/client/dashboard/StatsOverview';
import { RecentChats } from '../../components/client/dashboard/RecentChats';
import { useAuthStore } from '../../stores/authStore';

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useClientDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Recent Chats */}
      <RecentChats chats={stats.recent_chats} />
    </div>
  );
};