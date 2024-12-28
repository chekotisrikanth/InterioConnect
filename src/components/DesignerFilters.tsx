import React from 'react';
import { FilterSection } from './FilterSection';
import { FilterChip } from './FilterChip';
import { DesignerFilters } from '../types/filters';
import { DesignerStyle, RoomType, PortfolioType } from '../types';

const STYLES: DesignerStyle[] = ['Modern', 'Rustic', 'Traditional', 'Minimalist', 'Bohemian', 'Industrial'];
const ROOM_TYPES: RoomType[] = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Outdoor Spaces'];
const PORTFOLIO_TYPES: PortfolioType[] = ['2D Layouts', '3D Renders'];

interface RangeFilter {
  min: number;
  max: number;
}

interface DesignerFiltersProps {
  filters: DesignerFilters;
  onChange: (filters: DesignerFilters) => void;
}

export const DesignerFiltersPanel: React.FC<DesignerFiltersProps> = ({
  filters,
  onChange,
}) => {
  const updateArrayFilter = (
    key: keyof Pick<DesignerFilters, 'styles' | 'room_types' | 'portfolio_types'>,
    value: DesignerStyle | RoomType | PortfolioType
  ) => {
    const currentValues = (filters[key] || []) as Array<typeof value>;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onChange({ ...filters, [key]: newValues });
  };

  const updateRangeFilter = (key: keyof Pick<DesignerFilters, 'price_range' | 'experience_level' | 'rating' | 'completed_projects'>, value: RangeFilter) => {
    onChange({ ...filters, [key]: value });
  };

  const updatePriceUnit = (unit: 'sqft' | 'hour') => {
    onChange({ ...filters, price_unit: unit });
  };

  const removeFilter = (key: keyof DesignerFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => onChange({})}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Reset all
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.styles?.map(style => (
            <FilterChip
              key={style}
              label={style}
              onRemove={() => updateArrayFilter('styles', style)}
            />
          ))}
          {filters.room_types?.map(room => (
            <FilterChip
              key={room}
              label={room}
              onRemove={() => updateArrayFilter('room_types', room)}
            />
          ))}
          {filters.portfolio_types?.map(type => (
            <FilterChip
              key={type}
              label={type}
              onRemove={() => updateArrayFilter('portfolio_types', type)}
            />
          ))}
          {filters.price_unit && (
            <FilterChip
              key="price_unit"
              label={`Price: Per ${filters.price_unit}`}
              onRemove={() => {
                const newFilters = { ...filters };
                delete newFilters.price_unit;
                delete newFilters.price_range;
                onChange(newFilters);
              }}
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <FilterSection<DesignerStyle>
          title="Styles"
          options={STYLES}
          selectedValues={filters.styles}
          onChange={(value: DesignerStyle) => updateArrayFilter('styles', value)}
          multiSelect={true}
        />

        <FilterSection<RoomType>
          title="Room Types"
          options={ROOM_TYPES}
          selectedValues={filters.room_types}
          onChange={(value: RoomType) => updateArrayFilter('room_types', value)}
          multiSelect={true}
        />

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price</h3>
          <div className="flex items-center gap-4 mb-3">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filters.price_unit === 'sqft' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'
              }`}
              onClick={() => updatePriceUnit('sqft')}
            >
              Per sqft
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filters.price_unit === 'hour' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'
              }`}
              onClick={() => updatePriceUnit('hour')}
            >
              Per hour
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.price_range?.max || 500}
            onChange={(e) => updateRangeFilter('price_range', {
              min: 0,
              max: parseInt(e.target.value)
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.price_range?.max || 500}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h3>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.experience_level?.max || 20}
            onChange={(e) => updateRangeFilter('experience_level', {
              min: 0,
              max: parseInt(e.target.value)
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0 years</span>
            <span>{filters.experience_level?.max || 20} years</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating?.min || 0}
            onChange={(e) => updateRangeFilter('rating', {
              min: parseFloat(e.target.value),
              max: 5
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.rating?.min || 0}★</span>
            <span>5★</span>
          </div>
        </div>

        <FilterSection<PortfolioType>
          title="Portfolio Types"
          options={PORTFOLIO_TYPES}
          selectedValues={filters.portfolio_types}
          onChange={(value: PortfolioType) => updateArrayFilter('portfolio_types', value)}
          multiSelect={true}
        />

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Completed Projects</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.completed_projects?.min || 0}
            onChange={(e) => updateRangeFilter('completed_projects', {
              min: parseInt(e.target.value),
              max: 100
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.completed_projects?.min || 0}+</span>
            <span>100+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
