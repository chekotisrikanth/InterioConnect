import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Requirement, DesignerResponse } from '../../../types/client';
import { RequirementDetails } from '../../../components/client/requirements/RequirementDetails';

export const RequirementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [designerResponses, setDesignerResponses] = useState<DesignerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequirementDetails = async () => {
      try {
        // Fetch requirement details
        const { data: requirementData, error: requirementError } = await supabase
          .from('requirements')
          .select('*')
          .eq('id', id)
          .single();

        if (requirementError) throw requirementError;
        if (!requirementData) throw new Error('Requirement not found');

        setRequirement(requirementData);

        // Fetch designer responses with designer details
        const { data: responsesData, error: responsesError } = await supabase
          .from('designer_responses')
          .select(`
            *,
            designer:designer_id (
              id,
              name:profiles!inner(name),
              images:portfolio_images(image_url)
            )
          `)
          .eq('requirement_id', id);

        if (responsesError) throw responsesError;

        // Transform the responses data to match our types
        const transformedResponses = responsesData.map(response => ({
          ...response,
          designer: response.designer ? {
            ...response.designer,
            images: response.designer.images.map((img: { image_url: string }) => img.image_url)
          } : undefined
        }));

        setDesignerResponses(transformedResponses);
      } catch (err) {
        console.error('Error fetching requirement details:', err);
        setError('Failed to load requirement details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequirementDetails();
    }
  }, [id]);

  const handleStartChat = async (designerId: string) => {
    try {
      // Check if chat already exists
      const { data: existingChat, error: chatError } = await supabase
        .from('client_designer_chats')
        .select('id')
        .eq('requirement_id', id)
        .eq('designer_id', designerId)
        .single();

      if (chatError && chatError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw chatError;
      }

      if (existingChat) {
        navigate(`/client/chats/${existingChat.id}`);
        return;
      }

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('client_designer_chats')
        .insert({
          requirement_id: id,
          designer_id: designerId,
          client_id: requirement?.client_id,
          status: 'active'
        })
        .select()
        .single();

      if (createError) throw createError;

      navigate(`/client/chats/${newChat.id}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      // Show error toast or message
    }
  };

  const handleHireDesigner = async (designerId: string) => {
    try {
      // Create hired_designers record
      const { error: hireError } = await supabase
        .from('hired_designers')
        .insert({
          requirement_id: id,
          designer_id: designerId,
          client_id: requirement?.client_id,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (hireError) throw hireError;

      // Update requirement status
      const { error: updateError } = await supabase
        .from('requirements')
        .update({ status: 'in_progress' })
        .eq('id', id);

      if (updateError) throw updateError;

      // Refresh the requirement data
      window.location.reload();
    } catch (err) {
      console.error('Error hiring designer:', err);
      // Show error toast or message
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Requirement not found'}</p>
        <button
          onClick={() => navigate('/client/requirements')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Requirements
        </button>
      </div>
    );
  }

  return (
    <RequirementDetails
      requirement={requirement}
      designerResponses={designerResponses}
      onStartChat={handleStartChat}
      onHireDesigner={handleHireDesigner}
    />
  );
};
