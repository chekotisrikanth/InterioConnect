import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export const EarningsStats: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ['designerEarnings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: payments } = await supabase
        .from('payments')
        .select('amount, created_at, status')
        .eq('designer_id', user.id)
        .eq('status', 'completed');

      const totalEarnings = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyEarnings = payments?.reduce((sum, p) => {
        const paymentDate = new Date(p.created_at);
        if (paymentDate.getMonth() === currentMonth && 
            paymentDate.getFullYear() === currentYear) {
          return sum + p.amount;
        }
        return sum;
      }, 0) || 0;

      const pendingPayments = await supabase
        .from('payments')
        .select('amount')
        .eq('designer_id', user.id)
        .eq('status', 'pending');

      const pendingAmount = pendingPayments.data?.reduce((sum, p) => sum + p.amount, 0) || 0;

      return {
        totalEarnings,
        monthlyEarnings,
        pendingAmount,
        projectsCompleted: payments?.length || 0
      };
    },
    enabled: !!user?.id
  });

  const statCards = [
    {
      title: 'Total Earnings',
      value: `$${(stats?.totalEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Monthly Earnings',
      value: `$${(stats?.monthlyEarnings || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Projects Completed',
      value: stats?.projectsCompleted || 0,
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Pending Payments',
      value: `$${(stats?.pendingAmount || 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-yellow-100 text-yellow-600'
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