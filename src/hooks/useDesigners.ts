import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Designer } from '../types';
import { DesignerFilters } from '../types/filters';

export const useDesigners = (filters: DesignerFilters = {}) => {
  return useQuery<Designer[], Error>({
    queryKey: ['designers', filters],
    queryFn: async () => {
      let query = supabase
        .from('designer_profiles')
        .select(`
          *,
          profiles!inner (
            name,
            email
          ),
          portfolio_images (
            image_url
          ),
          location:location_id (
            id,
            name,
            type
          ),
          served_locations:designer_served_locations (
            location:location_id (
              id,
              name,
              type
            )
          )
        `)
        .eq('is_approved', true);

      // Apply location filter
      if (filters.locationId) {
        query = query.or(
          `location_id.eq.${filters.locationId},served_locations.location_id.eq.${filters.locationId}`
        );
      }

      // Apply other filters
      if (filters.styles?.length) {
        query = query.contains('styles', filters.styles);
      }

      if (filters.room_types?.length) {
        query = query.contains('room_types', filters.room_types);
      }

      if (filters.portfolio_types?.length) {
        query = query.contains('portfolio_types', filters.portfolio_types);
      }

      if (filters.price_range) {
        if (filters.price_unit) {
          query = query
            .eq('price_unit', filters.price_unit)
            .gte('price_per_unit', filters.price_range.min)
            .lte('price_per_unit', filters.price_range.max);
        }
      }

      if (filters.experience_level) {
        query = query
          .gte('experience_level', filters.experience_level.min)
          .lte('experience_level', filters.experience_level.max);
      }

      if (filters.rating) {
        query = query
          .gte('rating', filters.rating.min)
          .lte('rating', filters.rating.max);
      }

      if (filters.completed_projects) {
        query = query
          .gte('completed_projects', filters.completed_projects.min)
          .lte('completed_projects', filters.completed_projects.max);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(designer => ({
        ...designer,
        name: designer.profiles.name,
        images: designer.portfolio_images.map(img => img.image_url),
        location: designer.location,
        served_locations: designer.served_locations.map(sl => sl.location)
      }));
    }
  });
};