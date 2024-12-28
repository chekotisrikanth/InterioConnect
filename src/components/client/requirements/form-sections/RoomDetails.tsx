import React from 'react';
import { RequirementFormData } from '../../../../types/client';
import { ROOM_TYPES, DESIGNER_STYLES } from '../../../../constants';

interface RoomDetailsProps {
  formData: RequirementFormData;
  setFormData: (data: RequirementFormData) => void;
}

export const RoomDetails: React.FC<RoomDetailsProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Room Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Room Type
        </label>
        <select
          value={formData.room_type}
          onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select room type</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Style
        </label>
        <select
          value={formData.preferred_style}
          onChange={(e) => setFormData({ ...formData, preferred_style: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select preferred style</option>
          {DESIGNER_STYLES.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Budget Range
        </label>
        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={formData.budget_range.lower}
              onChange={(e) => setFormData({
                ...formData,
                budget_range: {
                  ...formData.budget_range,
                  lower: parseInt(e.target.value)
                }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Min budget"
              required
              min={0}
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.budget_range.upper}
              onChange={(e) => setFormData({
                ...formData,
                budget_range: {
                  ...formData.budget_range,
                  upper: parseInt(e.target.value)
                }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Max budget"
              required
              min={formData.budget_range.lower}
            />
          </div>
        </div>
      </div>
    </div>
  );
};