export type DesignerStyle = 'Modern' | 'Rustic' | 'Traditional' | 'Minimalist' | 'Bohemian' | 'Industrial';
export type RoomType = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Office' | 'Outdoor Spaces';
export type PortfolioType = '2D Layouts' | '3D Renders';

export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'locality';
}

export interface Designer {
  id: string;
  name: string;
  bio: string;
  specialty?: string[];
  styles: DesignerStyle[];
  room_types: RoomType[];
  services: {
    fullRoomDesign: boolean;
    consultation: boolean;
    eDesign: boolean;
  };
  pricing: {
    type: 'hourly' | 'fixed';
    rate: number;
    price_per_unit: number;
    price_unit: 'sqft' | 'hour';
  };
  images: string[];
  is_approved: boolean;
  experience?: number;
  experience_level: number;
  rating: number;
  projects?: number;
  completed_projects: number;
  portfolio_types: PortfolioType[];
  location?: Location;
  served_locations?: Location[];
}