import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Requirement } from '../../../types/client';
import { RequirementsList } from '../../../components/client/requirements/RequirementsList';

export const Requirements: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const { data: requirementsData, error: requirementsError } = await supabase
          .from('requirements')
          .select(`
            *,
            designer_responses (
              count
            )
          `)
          .order('created_at', { ascending: false });

        if (requirementsError) {
          throw requirementsError;
        }

        setRequirements(requirementsData || []);
      } catch (err) {
        console.error('Error fetching requirements:', err);
        setError('Failed to load requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <RequirementsList requirements={requirements} />;
};
