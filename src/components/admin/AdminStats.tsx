import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const AdminStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const [designers, users, projects] = await Promise.all([
        supabase.from('designer_profiles').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
        supabase.from('projects').select('id', { count: 'exact' }),
      ]);

      return {
        totalDesigners: designers.count || 0,
        totalUsers: users.count || 0,
        totalProjects: projects.count || 0,
        revenue: 0, // Implement when payment system is added
      };
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const statCards = [
    {
      title: 'Total Designers',
      value: stats?.totalDesigners || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Active Projects',
      value: stats?.totalProjects || 0,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add charts and graphs here */}
    </div>
  );
};