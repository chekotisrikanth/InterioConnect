import React from 'react';
import { RequirementFormData } from '../../../../types/client';

interface BasicInfoProps {
  formData: RequirementFormData;
  setFormData: (data: RequirementFormData) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Modern Living Room Makeover"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Describe your project requirements in detail..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location (Optional)
        </label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., San Francisco, CA"
        />
      </div>
    </div>
  );
};