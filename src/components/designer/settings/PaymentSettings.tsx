import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentSettings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['paymentSettings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('designer_profiles')
        .select('pricing, price_per_unit, price_unit')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updateSettings = useMutation({
    mutationFn: async (formData: any) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('designer_profiles')
        .update({
          pricing: {
            type: formData.pricingType,
            rate: parseFloat(formData.rate)
          },
          price_per_unit: parseFloat(formData.pricePerUnit),
          price_unit: formData.priceUnit
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentSettings']);
      toast.success('Payment settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    }
  });

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    updateSettings.mutate({
      pricingType: formData.get('pricingType'),
      rate: formData.get('rate'),
      pricePerUnit: formData.get('pricePerUnit'),
      priceUnit: formData.get('priceUnit')
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pricing Type</label>
          <select
            name="pricingType"
            defaultValue={settings?.pricing?.type}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="fixed">Fixed Rate</option>
            <option value="hourly">Hourly Rate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Base Rate ($)</label>
          <input
            type="number"
            name="rate"
            defaultValue={settings?.pricing?.rate}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Per Unit</label>
            <input
              type="number"
              name="pricePerUnit"
              defaultValue={settings?.price_per_unit}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Type</label>
            <select
              name="priceUnit"
              defaultValue={settings?.price_unit}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="sqft">Per Square Foot</option>
              <option value="hour">Per Hour</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettings.isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {updateSettings.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};