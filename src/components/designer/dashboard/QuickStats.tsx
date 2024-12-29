import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { FileText, Users, DollarSign, Star } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

export const QuickStats: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['designerStats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const [
        { count: newRequests },
        { count: activeProjects },
        { data: earnings },
        { data: profile }
      ] = await Promise.all([
        supabase
          .from('requirements')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open'),
        supabase
          .from('hired_designers')
          .select('*', { count: 'exact', head: true })
          .eq('designer_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('payments')
          .select('amount')
          .eq('designer_id', user.id)
          .eq('status', 'completed'),
        supabase
          .from('designer_profiles')
          .select('rating, profile_views')
          .eq('id', user.id)
          .single()
      ]);

      const totalEarnings = earnings?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      return {
        newRequests: newRequests || 0,
        activeProjects: activeProjects || 0,
        totalEarnings,
        rating: profile?.rating || 0,
        profileViews: profile?.profile_views || 0
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  const statCards = [
    {
      title: 'New Requests',
      value: stats?.newRequests || 0,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Earnings',
      value: `$${(stats?.totalEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Rating',
      value: `${stats?.rating.toFixed(1)} ★`,
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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