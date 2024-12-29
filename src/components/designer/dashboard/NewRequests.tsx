import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { parseBudgetRange } from '../../../utils/budgetRange';

export const NewRequests: React.FC = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['newRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requirements')
        .select(`
          *,
          client:client_id (
            full_name
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">New Requests</h2>
        <Link
          to="/designer/requests"
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {requests?.map((request) => {
          const budgetRange = parseBudgetRange(request.budget_range);
          return (
            <div
              key={request.id}
              className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {request.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {request.room_type} • ${budgetRange.lower.toLocaleString()} - ${budgetRange.upper.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  by {request.client?.full_name}
                </p>
              </div>
              <Link
                to={`/designer/requests/${request.id}`}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                View Details
              </Link>
            </div>
          );
        })}

        {requests?.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No new requests available
          </p>
        )}
      </div>
    </div>
  );
};