import React from 'react';
import { RequirementFormData } from '../../../../types/client';

interface TimelineProps {
  formData: RequirementFormData;
  setFormData: (data: RequirementFormData) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Project Timeline</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={formData.timeline_start || ''}
            onChange={(e) => setFormData({ ...formData, timeline_start: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={formData.timeline_end || ''}
            onChange={(e) => setFormData({ ...formData, timeline_end: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min={formData.timeline_start || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
};