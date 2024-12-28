export type UserRole = 'admin' | 'designer' | 'client' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface DesignerProfile extends UserProfile {
  bio: string;
  certifications: string[];
  awards: string[];
  services: {
    fullRoomDesign: boolean;
    consultation: boolean;
    eDesign: boolean;
  };
  pricing: {
    type: 'fixed' | 'hourly' | 'project';
    rate: number;
  };
  portfolio: {
    categoryId: string;
    images: string[];
    description: string;
    beforeAfterImages?: {
      before: string;
      after: string;
    }[];
  }[];
}
