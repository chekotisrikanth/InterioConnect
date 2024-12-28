/*
  # Add additional designer profile fields

  1. Changes
    - Create enums for style and room types
    - Add new columns to designer_profiles table
    - Update existing test designers with new field values
*/

-- Create enum types
CREATE TYPE designer_style AS ENUM (
  'Modern',
  'Rustic',
  'Traditional',
  'Minimalist',
  'Bohemian',
  'Industrial'
);

CREATE TYPE room_type AS ENUM (
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Office',
  'Outdoor Spaces'
);

CREATE TYPE portfolio_type AS ENUM (
  '2D Layouts',
  '3D Renders'
);

-- Add new columns to designer_profiles
ALTER TABLE designer_profiles
ADD COLUMN styles designer_style[] DEFAULT '{}',
ADD COLUMN room_types room_type[] DEFAULT '{}',
ADD COLUMN price_per_unit numeric(10,2),
ADD COLUMN price_unit text CHECK (price_unit IN ('sqft', 'hour')),
ADD COLUMN experience_level integer DEFAULT 0,
ADD COLUMN rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN portfolio_types portfolio_type[] DEFAULT '{}',
ADD COLUMN completed_projects integer DEFAULT 0;

-- Update existing test designers with new field values

-- Sofia Chen
UPDATE designer_profiles
SET 
  styles = ARRAY['Modern', 'Minimalist']::designer_style[],
  room_types = ARRAY['Living Room', 'Bedroom', 'Office']::room_type[],
  price_per_unit = 150.00,
  price_unit = 'hour',
  experience_level = 8,
  rating = 4.8,
  portfolio_types = ARRAY['2D Layouts', '3D Renders']::portfolio_type[],
  completed_projects = 45
WHERE id IN (
  SELECT id FROM profiles WHERE email = 'sofia.chen@example.com'
);

-- Marcus Rodriguez
UPDATE designer_profiles
SET 
  styles = ARRAY['Industrial', 'Modern']::designer_style[],
  room_types = ARRAY['Living Room', 'Office', 'Kitchen']::room_type[],
  price_per_unit = 75.00,
  price_unit = 'sqft',
  experience_level = 6,
  rating = 4.5,
  portfolio_types = ARRAY['3D Renders']::portfolio_type[],
  completed_projects = 32
WHERE id IN (
  SELECT id FROM profiles WHERE email = 'marcus.rodriguez@example.com'
);

-- Olivia Thompson
UPDATE designer_profiles
SET 
  styles = ARRAY['Traditional', 'Bohemian']::designer_style[],
  room_types = ARRAY['Living Room', 'Bedroom', 'Outdoor Spaces']::room_type[],
  price_per_unit = 175.00,
  price_unit = 'hour',
  experience_level = 12,
  rating = 4.9,
  portfolio_types = ARRAY['2D Layouts', '3D Renders']::portfolio_type[],
  completed_projects = 78
WHERE id IN (
  SELECT id FROM profiles WHERE email = 'olivia.thompson@example.com'
);

-- James Kim
UPDATE designer_profiles
SET 
  styles = ARRAY['Minimalist', 'Modern']::designer_style[],
  room_types = ARRAY['Living Room', 'Bedroom', 'Office']::room_type[],
  price_per_unit = 90.00,
  price_unit = 'sqft',
  experience_level = 10,
  rating = 4.7,
  portfolio_types = ARRAY['2D Layouts', '3D Renders']::portfolio_type[],
  completed_projects = 56
WHERE id IN (
  SELECT id FROM profiles WHERE email = 'james.kim@example.com'
);

-- Isabella Martinez
UPDATE designer_profiles
SET 
  styles = ARRAY['Traditional', 'Rustic']::designer_style[],
  room_types = ARRAY['Living Room', 'Kitchen', 'Outdoor Spaces']::room_type[],
  price_per_unit = 160.00,
  price_unit = 'hour',
  experience_level = 15,
  rating = 4.9,
  portfolio_types = ARRAY['2D Layouts']::portfolio_type[],
  completed_projects = 92
WHERE id IN (
  SELECT id FROM profiles WHERE email = 'isabella.martinez@example.com'
);
