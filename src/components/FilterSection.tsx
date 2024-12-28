import React from 'react';

interface FilterSectionProps<T extends string> {
  title: string;
  options: T[];
  selectedValue?: T;
  selectedValues?: T[];
  onChange: (value: T) => void;
  multiSelect?: boolean;
}

export const FilterSection = <T extends string>({
  title,
  options,
  selectedValue,
  selectedValues,
  onChange,
  multiSelect,
}: FilterSectionProps<T>): JSX.Element => {
  const isSelected = (option: T) => {
    if (multiSelect) {
      return selectedValues?.includes(option);
    }
    return selectedValue === option;
  };
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              isSelected(option)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
