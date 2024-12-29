import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Location, LocationType } from '../types/location';

export const useLocations = (type?: LocationType, parentId?: string) => {
  return useQuery({
    queryKey: ['locations', type, parentId],
    queryFn: async () => {
      let query = supabase
        .from('locations')
        .select('*')
        .order('name');

      if (type) {
        query = query.eq('type', type);
      }

      if (parentId) {
        query = query.eq('parent_id', parentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Location[];
    }
  });
};

export const useLocationHierarchy = (locationId?: string) => {
  return useQuery({
    queryKey: ['locationHierarchy', locationId],
    queryFn: async () => {
      if (!locationId) return null;

      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .single();

      if (error) throw error;

      // Get parent locations
      const parents = [];
      let currentId = data.parent_id;
      
      while (currentId) {
        const { data: parent, error: parentError } = await supabase
          .from('locations')
          .select('*')
          .eq('id', currentId)
          .single();

        if (parentError) throw parentError;
        parents.push(parent);
        currentId = parent.parent_id;
      }

      return {
        current: data,
        parents: parents.reverse()
      };
    },
    enabled: !!locationId
  });
};