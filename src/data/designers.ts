import { Designer, DesignerStyle, RoomType, PortfolioType } from '../types';

export const designers: Designer[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    specialty: ['Modern Minimalist', 'Scandinavian'],
    experience: 8,
    rating: 4.9,
    projects: 124,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
      'https://images.unsplash.com/photo-1615529328331-f8917597711f'
    ],
    bio: 'Award-winning designer specializing in modern minimalist spaces with over 8 years of experience transforming homes across the country.',
    styles: ['Modern', 'Minimalist'],
    room_types: ['Living Room', 'Bedroom', 'Office'],
    services: {
      fullRoomDesign: true,
      consultation: true,
      eDesign: true
    },
    pricing: {
      type: 'fixed',
      rate: 150,
      price_per_unit: 10,
      price_unit: 'sqft'
    },
    is_approved: true,
    experience_level: 8,
    completed_projects: 124,
    portfolio_types: ['2D Layouts', '3D Renders']
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialty: ['Contemporary', 'Industrial'],
    experience: 12,
    rating: 4.8,
    projects: 200,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
      'https://images.unsplash.com/photo-1545083036-b175dd155a1d',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221'
    ],
    bio: 'Passionate about creating industrial-inspired spaces that blend functionality with stunning aesthetics.',
    styles: ['Industrial', 'Modern'],
    room_types: ['Living Room', 'Kitchen', 'Office'],
    services: {
      fullRoomDesign: true,
      consultation: true,
      eDesign: false
    },
    pricing: {
      type: 'hourly',
      rate: 200,
      price_per_unit: 200,
      price_unit: 'hour'
    },
    is_approved: true,
    experience_level: 12,
    completed_projects: 200,
    portfolio_types: ['2D Layouts', '3D Renders']
  },
  {
    id: '3',
    name: 'Emma Roberts',
    specialty: ['Bohemian', 'Eclectic'],
    experience: 6,
    rating: 4.7,
    projects: 85,
    images: [
      'https://images.unsplash.com/photo-1602872030219-ad2b9a54315c',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200',
      'https://images.unsplash.com/photo-1615529328331-f8917597711f'
    ],
    bio: 'Specializing in creating unique, personality-filled spaces that tell your story through thoughtful design.',
    styles: ['Bohemian', 'Traditional'],
    room_types: ['Living Room', 'Bedroom', 'Kitchen'],
    services: {
      fullRoomDesign: true,
      consultation: true,
      eDesign: true
    },
    pricing: {
      type: 'fixed',
      rate: 125,
      price_per_unit: 8,
      price_unit: 'sqft'
    },
    is_approved: true,
    experience_level: 6,
    completed_projects: 85,
    portfolio_types: ['2D Layouts']
  }
];
