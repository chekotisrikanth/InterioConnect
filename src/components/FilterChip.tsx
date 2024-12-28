import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
      <span className="text-sm">{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-indigo-200 rounded-full"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};