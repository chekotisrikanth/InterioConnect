import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Location, LocationType } from '../types/location';

export const useLocations = (type?: LocationType, parentId?: string) => {
  return useQuery({
    queryKey: ['locations', type, parentId],
    queryFn: async () => {
      try {
        console.log('Starting locations query...');

        // Build query with debug info
        const tableName = 'locations';
        const selectColumns = '*';
        console.log(`Querying table: ${tableName}, selecting: ${selectColumns}`);

        let query = supabase
          .from(tableName)
          .select(selectColumns);

        // First, let's check what data exists
        const { data: allLocations } = await supabase
          .from('locations')
          .select('*');
        
        console.log('All locations in database:', allLocations);

        // Add filters with case matching
        if (type) {
          const dbType = type.toLowerCase();
          console.log(`Adding type filter: ${dbType} (original: ${type})`);
          query = query.eq('type', dbType);
        }

        if (parentId) {
          console.log(`Adding parent_id filter: ${parentId}`);
          query = query.eq('parent_id', parentId);
        }

        // Add ordering
        query = query.order('name');

        // Execute query and log full details
        console.log('Query parameters:', {
          type: type || 'none',
          parentId: parentId || 'none',
          filters: {
            hasTypeFilter: !!type,
            hasParentFilter: !!parentId
          }
        });

        const { data, error, status, statusText, count } = await query;

        // Log raw response
        console.log('Raw Supabase response:', {
          status,
          statusText,
          error,
          count,
          dataReceived: !!data,
          dataLength: data?.length ?? 0,
          firstRecord: data?.[0]
        });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log(`No locations found for type: ${type}, parentId: ${parentId}`);
          return [];
        }

        // Log success with sample data
        console.log('Successfully fetched locations:', {
          count: data.length,
          type,
          parentId,
          sampleData: data.slice(0, 2)
        });

        return data as Location[];
      } catch (error) {
        console.error('Unexpected error in useLocations:', error);
        throw error;
      }
    },
    staleTime: 0, // Always fetch fresh data
    retry: 2,
    retryDelay: 1000
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
