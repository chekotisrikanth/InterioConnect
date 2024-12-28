import React, { useState, useEffect } from 'react';
import { DesignerCard } from '../components/DesignerCard';
import { DesignerFiltersPanel } from '../components/DesignerFilters';
import { Designer } from '../types';
import { DesignerFilters } from '../types/filters';
import { Search, Loader2 } from 'lucide-react';
import { getDesigners } from '../lib/designers';
import { ImageCarousel } from '../components/ImageCarousel';

export const BrowseDesigners: React.FC = () => {
  const [filters, setFilters] = useState<DesignerFilters>({
    price_range: { min: 0, max: 500 },
    experience_level: { min: 0, max: 20 },
    rating: { min: 0, max: 5 },
    completed_projects: { min: 0, max: 100 }
  });
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredDesigners = React.useMemo(() => {
    return designers.filter(designer => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!designer.name.toLowerCase().includes(query) && 
            !designer.bio.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Styles
      if (filters.styles?.length && 
          !filters.styles.some(style => designer.styles.includes(style))) {
        return false;
      }

      // Room types
      if (filters.room_types?.length && 
          !filters.room_types.some(type => designer.room_types.includes(type))) {
        return false;
      }

      // Price range
      if (filters.price_range) {
        const price = designer.pricing.price_per_unit;
        if (price < filters.price_range.min || price > filters.price_range.max) {
          return false;
        }
        // Price unit must match if specified
        if (filters.price_unit && designer.pricing.price_unit !== filters.price_unit) {
          return false;
        }
      }

      // Experience level
      if (filters.experience_level && 
          (designer.experience_level < filters.experience_level.min || 
           designer.experience_level > filters.experience_level.max)) {
        return false;
      }

      // Rating
      if (filters.rating && 
          (designer.rating < filters.rating.min || 
           designer.rating > filters.rating.max)) {
        return false;
      }

      // Portfolio types
      if (filters.portfolio_types?.length && 
          !filters.portfolio_types.some(type => designer.portfolio_types.includes(type))) {
        return false;
      }

      // Completed projects
      if (filters.completed_projects && 
          (designer.completed_projects < filters.completed_projects.min || 
           designer.completed_projects > filters.completed_projects.max)) {
        return false;
      }

      return true;
    });
  }, [designers, filters, searchQuery]);

  useEffect(() => {
    const loadDesigners = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDesigners();
        setDesigners(data);
      } catch (err) {
        setError('Failed to load designers. Please try again later.');
        console.error('Error loading designers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesigners();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Designers</h1>
      
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <DesignerFiltersPanel
            filters={filters}
            onChange={setFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="relative max-w-xl mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Search designers..."
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDesigners.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onClick={setSelectedDesigner}
              />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Designer Modal */}
      {selectedDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">{selectedDesigner.name}</h2>
              <button 
                onClick={() => setSelectedDesigner(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-80">
              <ImageCarousel 
                images={selectedDesigner.images} 
                alt={selectedDesigner.name}
              />
            </div>
            <p className="text-gray-600 my-4">{selectedDesigner.bio}</p>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
