import { supabase } from './supabase';
import { Location } from '../types/location';

// Test function to verify Supabase connection and locations table access
export async function testLocationsAccess() {
  console.log('Testing Supabase connection and locations table access...');
  
  try {
    // Test querying all locations
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('type');
    
    if (error) {
      console.error('Error fetching locations:', error);
      return;
    }

    const locations = data as Location[];
    
    // Log raw data first
    console.log('Raw locations data:', locations);

    // Group by type and count
    const summary = locations.reduce((acc: Record<string, number>, loc) => {
      acc[loc.type] = (acc[loc.type] || 0) + 1;
      return acc;
    }, {});

    console.log('Locations summary:', {
      total: locations.length,
      byType: summary,
      sampleData: locations.slice(0, 3)
    });

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test immediately when imported
testLocationsAccess().catch(console.error);
