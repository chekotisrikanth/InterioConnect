import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { Image, Eye, Star, ThumbsUp } from 'lucide-react';

export const PortfolioStats: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ['portfolioStats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const [
        { count: totalProjects },
        { data: profile },
        { count: totalViews },
        { count: totalLikes }
      ] = await Promise.all([
        supabase
          .from('portfolio_items')
          .select('*', { count: 'exact', head: true })
          .eq('designer_id', user.id),
        supabase
          .from('designer_profiles')
          .select('rating')
          .eq('id', user.id)
          .single(),
        supabase
          .from('portfolio_views')
          .select('*', { count: 'exact', head: true })
          .eq('designer_id', user.id),
        supabase
          .from('portfolio_likes')
          .select('*', { count: 'exact', head: true })
          .eq('designer_id', user.id)
      ]);

      return {
        totalProjects: totalProjects || 0,
        rating: profile?.rating || 0,
        totalViews: totalViews || 0,
        totalLikes: totalLikes || 0
      };
    },
    enabled: !!user?.id
  });

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: Image,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Portfolio Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Rating',
      value: `${(stats?.rating || 0).toFixed(1)} ★`,
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: ThumbsUp,
      color: 'bg-purple-100 text-purple-600'
    }
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