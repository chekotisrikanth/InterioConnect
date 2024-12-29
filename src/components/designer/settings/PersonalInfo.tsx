import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const PersonalInfo: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['designerProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('designer_profiles')
        .select(`
          *,
          profile:profiles!inner(
            name,
            email
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updateProfile = useMutation({
    mutationFn: async (formData: any) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update designer_profiles table
      const { error: designerError } = await supabase
        .from('designer_profiles')
        .update({
          bio: formData.bio,
          certifications: formData.certifications.split(',').map((c: string) => c.trim()),
          services: formData.services
        })
        .eq('id', user.id);

      if (designerError) throw designerError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['designerProfile']);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    updateProfile.mutate({
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
      certifications: formData.get('certifications'),
      services: {
        fullRoomDesign: formData.get('fullRoomDesign') === 'on',
        consultation: formData.get('consultation') === 'on',
        eDesign: formData.get('eDesign') === 'on'
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={profile?.profile?.name}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={profile?.profile?.email}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile?.bio}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Certifications (comma-separated)
          </label>
          <input
            type="text"
            name="certifications"
            defaultValue={profile?.certifications?.join(', ')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services Offered
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="fullRoomDesign"
                defaultChecked={profile?.services?.fullRoomDesign}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Full Room Design</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="consultation"
                defaultChecked={profile?.services?.consultation}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Consultation</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="eDesign"
                defaultChecked={profile?.services?.eDesign}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">E-Design</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateProfile.isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {updateProfile.isLoading ? (
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