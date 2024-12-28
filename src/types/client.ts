import { Designer, DesignerStyle, RoomType } from './index';

export type RequirementStatus = 'open' | 'in_progress' | 'closed';
export type ChatStatus = 'active' | 'archived';
export type NotificationType = 'message' | 'response' | 'update' | 'system';

export interface ClientProfile {
  id: string;
  full_name: string;
  email: string;
  preferred_styles: DesignerStyle[];
  preferred_budget_range?: {
    lower: number;
    upper: number;
  };
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
  budget_range: {
    lower: number;
    upper: number;
  };
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

export interface DesignerResponse {
  id: string;
  requirement_id: string;
  designer_id: string;
  designer?: Designer;
  proposal: string;
  estimated_cost?: number;
  estimated_timeline?: number;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  client_id: string;
  designer_id: string;
  designer?: Designer;
  requirement_id?: string;
  requirement?: Requirement;
  status: ChatStatus;
  last_message?: ChatMessage;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  created_at: string;
}

export interface Notification {
  id: string;
  client_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  related_entity_id?: string;
  created_at: string;
}

export interface BookmarkedDesigner {
  client_id: string;
  designer_id: string;
  designer: Designer;
  created_at: string;
}

export interface HiredDesigner {
  id: string;
  client_id: string;
  designer_id: string;
  designer: Designer;
  requirement_id: string;
  requirement: Requirement;
  status: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard overview stats
export interface DashboardStats {
  active_projects: number;
  pending_responses: number;
  unread_messages: number;
  recent_chats: Chat[];
}

// Form types for submitting requirements
export interface RequirementFormData {
  title: string;
  room_type: RoomType;
  preferred_style: DesignerStyle;
  budget_range: {
    lower: number;
    upper: number;
  };
  description: string;
  images: File[];
  location?: string;
  timeline_start?: string;
  timeline_end?: string;
  visibility: boolean;
}
