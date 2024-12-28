import { DesignerStyle, RoomType, PortfolioType } from './index';

export interface DesignerFilters {
  styles?: DesignerStyle[];
  room_types?: RoomType[];
  price_range?: {
    min: number;
    max: number;
  };
  price_unit?: 'sqft' | 'hour';
  experience_level?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  portfolio_types?: PortfolioType[];
  completed_projects?: {
    min: number;
    max: number;
  };
}
