import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationPreferences: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notificationPreferences', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('designer_notification_preferences')
        .select('*')
        .eq('designer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updatePreferences = useMutation({
    mutationFn: async (formData: any) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('designer_notification_preferences')
        .upsert({
          designer_id: user.id,
          ...formData
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notificationPreferences']);
      toast.success('Notification preferences updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update preferences');
    }
  });

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    updatePreferences.mutate({
      email_notifications: formData.get('emailNotifications') === 'on',
      new_requirements: formData.get('newRequirements') === 'on',
      messages: formData.get('messages') === 'on',
      project_updates: formData.get('projectUpdates') === 'on',
      marketing_emails: formData.get('marketingEmails') === 'on'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="emailNotifications"
              defaultChecked={preferences?.email_notifications}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Enable email notifications
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="newRequirements"
              defaultChecked={preferences?.new_requirements}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Notify me about new design requirements
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="messages"
              defaultChecked={preferences?.messages}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Notify me about new messages
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="projectUpdates"
              defaultChecked={preferences?.project_updates}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Notify me about project updates
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="marketingEmails"
              defaultChecked={preferences?.marketing_emails}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Receive marketing emails and newsletters
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updatePreferences.isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {updatePreferences.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};