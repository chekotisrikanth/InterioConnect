import React, { useState } from 'react';
import { LocationSelector } from '../components/common/LocationSelector';
import { useLocations } from '../hooks/useLocations';

export const LocationTest = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // Test direct query to verify data access
  const { data: countries, error } = useLocations('country');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Location Selector Test</h1>
      
      {/* Debug info */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">Debug Information</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Countries loaded:</strong>{' '}
            {countries ? countries.length : 'None'}
          </div>
          {error && (
            <div className="text-red-600">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <div>
            <strong>Selected location:</strong>{' '}
            {selectedLocation || 'None'}
          </div>
        </div>
      </div>

      {/* Location selector */}
      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-4">Select Location</h2>
        <LocationSelector
          value={selectedLocation}
          onChange={setSelectedLocation}
        />
      </div>
    </div>
  );
};
