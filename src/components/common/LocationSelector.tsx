import React, { useState, useEffect } from 'react';
import { useLocations, useLocationHierarchy } from '../../hooks/useLocations';
import { LocationType } from '../../types/location';
import { Loader2 } from 'lucide-react';

interface LocationSelectorProps {
  value?: string;
  onChange: (locationId: string) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');

  // Fetch locations for each level
  const { data: countries, isLoading: loadingCountries } = useLocations('country');
  const { data: states, isLoading: loadingStates } = useLocations(
    'state',
    selectedCountry
  );
  const { data: cities, isLoading: loadingCities } = useLocations(
    'city',
    selectedState
  );
  const { data: localities, isLoading: loadingLocalities } = useLocations(
    'locality',
    selectedCity
  );

  // Load initial hierarchy if value is provided
  const { data: hierarchy } = useLocationHierarchy(value);

  useEffect(() => {
    if (hierarchy) {
      const { current, parents } = hierarchy;
      
      // Set each level based on the hierarchy
      parents.forEach(location => {
        switch (location.type) {
          case 'country':
            setSelectedCountry(location.id);
            break;
          case 'state':
            setSelectedState(location.id);
            break;
          case 'city':
            setSelectedCity(location.id);
            break;
        }
      });
      
      if (current.type === 'locality') {
        setSelectedLocality(current.id);
      }
    }
  }, [hierarchy]);

  const handleLocationChange = (type: LocationType, id: string) => {
    switch (type) {
      case 'country':
        setSelectedCountry(id);
        setSelectedState('');
        setSelectedCity('');
        setSelectedLocality('');
        break;
      case 'state':
        setSelectedState(id);
        setSelectedCity('');
        setSelectedLocality('');
        break;
      case 'city':
        setSelectedCity(id);
        setSelectedLocality('');
        break;
      case 'locality':
        setSelectedLocality(id);
        onChange(id);
        break;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => handleLocationChange('country', e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={loadingCountries}
        >
          <option value="">Select country</option>
          {countries?.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            value={selectedState}
            onChange={(e) => handleLocationChange('state', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loadingStates}
          >
            <option value="">Select state</option>
            {states?.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <select
            value={selectedCity}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loadingCities}
          >
            <option value="">Select city</option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Locality
          </label>
          <select
            value={selectedLocality}
            onChange={(e) => handleLocationChange('locality', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loadingLocalities}
          >
            <option value="">Select locality</option>
            {localities?.map((locality) => (
              <option key={locality.id} value={locality.id}>
                {locality.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(loadingCountries ||
        loadingStates ||
        loadingCities ||
        loadingLocalities) && (
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        </div>
      )}
    </div>
  );
};