import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { CreditCard, Bank, Loader2 } from 'lucide-react';

export const PaymentDetails: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: paymentInfo, isLoading } = useQuery({
    queryKey: ['designerPaymentInfo', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('designer_payment_info')
        .select('*')
        .eq('designer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
      </div>
      <div className="p-6">
        {paymentInfo ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Bank Account
              </h3>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Bank className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-900">
                    {paymentInfo.bank_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ****{paymentInfo.account_number.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Payment Schedule
              </h3>
              <p className="text-sm text-gray-600">
                Payments are processed every {paymentInfo.payment_schedule || 'month'} 
                on the {paymentInfo.payment_day || '1st'}
              </p>
            </div>

            <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
              Update Payment Information
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No payment details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your payment information to receive payments
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Add Payment Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};