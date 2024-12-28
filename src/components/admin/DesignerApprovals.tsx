import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const DesignerApprovals = () => {
  const { data: pendingApprovals, isLoading } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designer_approvals')
        .select(`
          *,
          designer:designer_profiles(
            id,
            bio,
            certifications,
            services
          ),
          profile:profiles(
            name,
            email
          )
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ designerId, feedback }: { designerId: string; feedback: string }) => {
      const { error } = await supabase
        .from('designer_approvals')
        .update({
          status: 'approved',
          admin_feedback: feedback,
        })
        .eq('designer_id', designerId);

      if (error) throw error;

      // Update designer profile
      await supabase
        .from('designer_profiles')
        .update({ is_approved: true, approval_date: new Date().toISOString() })
        .eq('id', designerId);
    },
    onSuccess: () => {
      toast.success('Designer approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pending Designer Approvals</h2>
      <div className="grid gap-6">
        {pendingApprovals?.map((approval) => (
          <div key={approval.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{approval.profile.name}</h3>
                <p className="text-gray-600">{approval.profile.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approveMutation.mutate({
                    designerId: approval.designer_id,
                    feedback: 'Approved',
                  })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => approveMutation.mutate({
                    designerId: approval.designer_id,
                    feedback: 'Rejected',
                  })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Bio</h4>
              <p className="text-gray-600">{approval.designer.bio}</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Certifications</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {approval.designer.certifications.map((cert: string) => (
                  <span key={cert} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};