import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementForm } from '../../../hooks/useRequirementForm';
import { BasicInfo } from './form-sections/BasicInfo';
import { RoomDetails } from './form-sections/RoomDetails';
import { Timeline } from './form-sections/Timeline';
import { ImageUpload } from './form-sections/ImageUpload';
import { Loader2 } from 'lucide-react';

export const RequirementForm: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData, handleSubmit, isSubmitting, error } = useRequirementForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Requirement</h2>

        <div className="space-y-8">
          <BasicInfo formData={formData} setFormData={setFormData} />
          <RoomDetails formData={formData} setFormData={setFormData} />
          <Timeline formData={formData} setFormData={setFormData} />
          <ImageUpload formData={formData} setFormData={setFormData} />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/client/requirements')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Requirement'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};