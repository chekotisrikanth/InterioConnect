import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
}

export const usePaymentHistory = () => {
  const user = useAuthStore((state) => state.user);

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['paymentHistory', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return {
    payments,
    isLoading
  };
};