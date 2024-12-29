import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Designer } from '../types';
import { DesignerFilters } from '../types/filters';

export const useDesigners = (filters: DesignerFilters = {}) => {
  return useQuery<Designer[], Error>({
    queryKey: ['designers', filters],
    queryFn: async () => {
      console.log('Constructing designers query with filters:', filters);
      
      let query = supabase
        .from('designer_profiles')
        .select(`
          *,
          profiles (
            name,
            email
          ),
          portfolio_images (
            image_url
          )
        `)
        .eq('is_approved', true);

      // Apply other filters
      // Apply location filter
      if (filters.locationId) {
        query = query.or(
          `location_id.eq.${filters.locationId},served_locations.location_id.eq.${filters.locationId}`
        );
      }

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

      console.log('Raw query result:', { 
        success: !error,
        error: error?.message,
        dataCount: data?.length,
        firstItem: data?.[0]
      });

      if (error) throw error;

      const mappedData = data.map(designer => {
        if (!designer.profiles) {
          console.log('Designer missing profile:', designer.id);
        }
        return {
          ...designer,
          name: designer.profiles?.name ?? 'Unknown Designer',
          images: (designer.portfolio_images ?? []).map((img: { image_url: string }) => img.image_url)
        };
      });

      console.log('Mapped designer data:', mappedData);
      return mappedData;
    }
  });
};
