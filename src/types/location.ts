export type LocationType = 'country' | 'state' | 'city' | 'locality';

export interface Location {
  id: string;
  name: string;
  parent_id: string | null;
  type: LocationType;
  created_at: string;
  updated_at: string;
}

export interface LocationHierarchy {
  current: Location;
  parents: Location[];
}