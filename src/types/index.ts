export type DesignerStyle = 'Modern' | 'Rustic' | 'Traditional' | 'Minimalist' | 'Bohemian' | 'Industrial';
export type RoomType = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Office' | 'Outdoor Spaces';
export type PortfolioType = '2D Layouts' | '3D Renders';

export interface Designer {
  id: string;
  name: string;
  bio: string;
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
  styles: DesignerStyle[];
  room_types: RoomType[];
  experience_level: number;
  rating: number;
  portfolio_types: PortfolioType[];
  completed_projects: number;
}

export interface Project {
  id: string;
  designerId: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}
