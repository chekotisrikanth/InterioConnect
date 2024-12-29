import { Designer, DesignerStyle, RoomType } from './index';

export type RequirementStatus = 'open' | 'in_progress' | 'closed';
export type ChatStatus = 'active' | 'archived';
export type NotificationType = 'message' | 'response' | 'update' | 'system';

export interface BudgetRange {
  lower: number;
  upper: number;
}

export interface ClientProfile {
  id: string;
  full_name: string;
  email: string;
  preferred_styles: DesignerStyle[];
  preferred_budget_range?: BudgetRange;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  client_id: string;
  title: string;
  room_type: RoomType;
  preferred_style: DesignerStyle;
  budget_range: string; // PostgreSQL int4range format
  description: string;
  images: string[];
  location?: string;
  timeline_start?: string;
  timeline_end?: string;
  status: RequirementStatus;
  visibility: boolean;
  created_at: string;
  updated_at: string;
}

// Rest of the types remain unchanged...