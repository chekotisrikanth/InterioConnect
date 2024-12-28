import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { HiredDesigner } from '../../../types/client';
import { HiredDesignersList } from '../../../components/client/designers/HiredDesignersList';

export const HiredDesigners: React.FC = () => {
  const [designers, setDesigners] = useState<HiredDesigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHiredDesigners = async () => {
      try {
        const { data: designersData, error: designersError } = await supabase
          .from('hired_designers')
          .select(`
            *,
            designer:designer_id (
              id,
              name:profiles!inner(name),
              images:portfolio_images(image_url)
            ),
            requirement:requirement_id (*)
          `)
          .order('created_at', { ascending: false });

        if (designersError) throw designersError;

        // Transform the data to match our types
        const transformedDesigners = designersData?.map(designer => ({
          ...designer,
          designer: {
            ...designer.designer,
            images: designer.designer.images.map((img: { image_url: string }) => img.image_url)
          }
        }));

        setDesigners(transformedDesigners || []);
      } catch (err) {
        console.error('Error fetching hired designers:', err);
        setError('Failed to load hired designers');
      } finally {
        setLoading(false);
      }
    };

    fetchHiredDesigners();

    // Subscribe to changes in hired_designers table
    const subscription = supabase
      .channel('hired_designers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hired_designers',
        },
        () => {
          // Refresh the data when there are changes
          fetchHiredDesigners();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

  return <HiredDesignersList designers={designers} />;
};
