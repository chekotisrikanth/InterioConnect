import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { RequirementFormData } from '../types/client';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const initialFormData: RequirementFormData = {
  title: '',
  description: '',
  room_type: '',
  preferred_style: '',
  budget_range: {
    lower: 0,
    upper: 0
  },
  images: [],
  location: '',
  timeline_start: '',
  timeline_end: '',
  visibility: true
};

export const useRequirementForm = () => {
  const [formData, setFormData] = useState<RequirementFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a requirement');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images first
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          const fileName = `${user.id}/${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('requirement-images')
            .upload(fileName, file);

          if (error) throw error;
          return data.path;
        })
      );

      // Create the requirement
      const { error: requirementError } = await supabase
        .from('requirements')
        .insert({
          client_id: user.id,
          title: formData.title,
          room_type: formData.room_type,
          preferred_style: formData.preferred_style,
          budget_range: `[${formData.budget_range.lower},${formData.budget_range.upper}]`,
          description: formData.description,
          images: imageUrls,
          location: formData.location,
          timeline_start: formData.timeline_start,
          timeline_end: formData.timeline_end,
          visibility: formData.visibility
        });

      if (requirementError) throw requirementError;

      toast.success('Requirement submitted successfully');
      navigate('/client/requirements');
    } catch (err: any) {
      console.error('Error submitting requirement:', err);
      setError(err.message);
      toast.error('Failed to submit requirement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
    error
  };
};