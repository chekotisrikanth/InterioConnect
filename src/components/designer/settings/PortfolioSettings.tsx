import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { ROOM_TYPES, DESIGNER_STYLES } from '../../../constants';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const PortfolioSettings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['portfolioSettings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('designer_profiles')
        .select('styles, room_types, portfolio_types')
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
          styles: formData.styles,
          room_types: formData.roomTypes,
          portfolio_types: formData.portfolioTypes
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolioSettings']);
      toast.success('Portfolio settings updated successfully');
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
      styles: formData.getAll('styles'),
      roomTypes: formData.getAll('roomTypes'),
      portfolioTypes: formData.getAll('portfolioTypes')
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Portfolio Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Design Styles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DESIGNER_STYLES.map((style) => (
              <label key={style} className="flex items-center">
                <input
                  type="checkbox"
                  name="styles"
                  value={style}
                  defaultChecked={settings?.styles?.includes(style)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Types
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ROOM_TYPES.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  name="roomTypes"
                  value={type}
                  defaultChecked={settings?.room_types?.includes(type)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio Types
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="portfolioTypes"
                value="2D Layouts"
                defaultChecked={settings?.portfolio_types?.includes('2D Layouts')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">2D Layouts</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="portfolioTypes"
                value="3D Renders"
                defaultChecked={settings?.portfolio_types?.includes('3D Renders')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">3D Renders</span>
            </label>
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
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};