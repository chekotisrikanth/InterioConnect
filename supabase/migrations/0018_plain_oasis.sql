/*
  # Fix Designer Data

  1. Changes
    - Fix services and pricing JSONB data
    - Ensure proper linking between auth users and profiles
    - Clean up any duplicate data

  2. Security
    - No changes to RLS policies
*/

-- First, clean up any potential duplicate data
DELETE FROM portfolio_images
WHERE designer_id IN (
  SELECT id FROM designer_profiles 
  WHERE id IN (
    SELECT id FROM profiles 
    WHERE email LIKE 'designer%@example.com'
  )
);

DELETE FROM designer_profiles
WHERE id IN (
  SELECT id FROM profiles 
  WHERE email LIKE 'designer%@example.com'
);

DELETE FROM profiles
WHERE email LIKE 'designer%@example.com';

-- Now insert the correct data
WITH designer_auth_users AS (
  SELECT id, email
  FROM auth.users
  WHERE email LIKE 'designer%@example.com'
)
INSERT INTO profiles (id, email, role, name, email_verified)
SELECT 
  id,
  email,
  'designer',
  CASE email
    WHEN 'designer1@example.com' THEN 'Sarah Anderson'
    WHEN 'designer2@example.com' THEN 'Michael Chen'
    WHEN 'designer3@example.com' THEN 'Emma Roberts'
    WHEN 'designer4@example.com' THEN 'David Wilson'
    WHEN 'designer5@example.com' THEN 'Sofia Martinez'
  END,
  true
FROM designer_auth_users;

-- Insert designer profiles with correct JSONB data
INSERT INTO designer_profiles (
  id,
  bio,
  services,
  pricing,
  styles,
  room_types,
  price_per_unit,
  price_unit,
  experience_level,
  rating,
  portfolio_types,
  completed_projects,
  is_approved
)
SELECT 
  p.id,
  CASE p.email
    WHEN 'designer1@example.com' THEN 'Award-winning designer specializing in modern minimalist spaces with over 8 years of experience.'
    WHEN 'designer2@example.com' THEN 'Passionate about creating industrial-inspired spaces that blend functionality with stunning aesthetics.'
    WHEN 'designer3@example.com' THEN 'Creating unique, personality-filled spaces that tell your story through thoughtful design.'
    WHEN 'designer4@example.com' THEN 'Specializing in contemporary design with a focus on sustainable materials and practices.'
    WHEN 'designer5@example.com' THEN 'Bringing Mediterranean warmth and elegance to modern spaces with timeless design principles.'
  END,
  jsonb_build_object(
    'fullRoomDesign', true,
    'consultation', true,
    'eDesign', CASE p.email
      WHEN 'designer2@example.com' THEN false
      WHEN 'designer4@example.com' THEN false
      ELSE true
    END
  ),
  jsonb_build_object(
    'type', CASE p.email
      WHEN 'designer1@example.com' THEN 'fixed'
      WHEN 'designer2@example.com' THEN 'hourly'
      WHEN 'designer3@example.com' THEN 'fixed'
      WHEN 'designer4@example.com' THEN 'hourly'
      WHEN 'designer5@example.com' THEN 'fixed'
    END,
    'rate', CASE p.email
      WHEN 'designer1@example.com' THEN 150
      WHEN 'designer2@example.com' THEN 200
      WHEN 'designer3@example.com' THEN 125
      WHEN 'designer4@example.com' THEN 175
      WHEN 'designer5@example.com' THEN 160
    END
  ),
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['Modern', 'Minimalist']::designer_style[]
    WHEN 'designer2@example.com' THEN ARRAY['Industrial', 'Modern']::designer_style[]
    WHEN 'designer3@example.com' THEN ARRAY['Bohemian', 'Traditional']::designer_style[]
    WHEN 'designer4@example.com' THEN ARRAY['Modern', 'Industrial']::designer_style[]
    WHEN 'designer5@example.com' THEN ARRAY['Traditional', 'Modern']::designer_style[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['Living Room', 'Bedroom', 'Office']::room_type[]
    WHEN 'designer2@example.com' THEN ARRAY['Living Room', 'Kitchen', 'Office']::room_type[]
    WHEN 'designer3@example.com' THEN ARRAY['Living Room', 'Bedroom', 'Kitchen']::room_type[]
    WHEN 'designer4@example.com' THEN ARRAY['Office', 'Living Room', 'Kitchen']::room_type[]
    WHEN 'designer5@example.com' THEN ARRAY['Living Room', 'Bedroom', 'Kitchen']::room_type[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 10
    WHEN 'designer2@example.com' THEN 200
    WHEN 'designer3@example.com' THEN 8
    WHEN 'designer4@example.com' THEN 175
    WHEN 'designer5@example.com' THEN 12
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 'sqft'
    WHEN 'designer2@example.com' THEN 'hour'
    WHEN 'designer3@example.com' THEN 'sqft'
    WHEN 'designer4@example.com' THEN 'hour'
    WHEN 'designer5@example.com' THEN 'sqft'
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 8
    WHEN 'designer2@example.com' THEN 12
    WHEN 'designer3@example.com' THEN 6
    WHEN 'designer4@example.com' THEN 10
    WHEN 'designer5@example.com' THEN 15
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 4.9
    WHEN 'designer2@example.com' THEN 4.8
    WHEN 'designer3@example.com' THEN 4.7
    WHEN 'designer4@example.com' THEN 4.9
    WHEN 'designer5@example.com' THEN 4.8
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['2D Layouts', '3D Renders']::portfolio_type[]
    WHEN 'designer2@example.com' THEN ARRAY['2D Layouts', '3D Renders']::portfolio_type[]
    WHEN 'designer3@example.com' THEN ARRAY['2D Layouts']::portfolio_type[]
    WHEN 'designer4@example.com' THEN ARRAY['3D Renders']::portfolio_type[]
    WHEN 'designer5@example.com' THEN ARRAY['2D Layouts', '3D Renders']::portfolio_type[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 124
    WHEN 'designer2@example.com' THEN 200
    WHEN 'designer3@example.com' THEN 85
    WHEN 'designer4@example.com' THEN 150
    WHEN 'designer5@example.com' THEN 180
  END,
  true
FROM profiles p
WHERE p.email LIKE 'designer%@example.com';

-- Add portfolio images
INSERT INTO portfolio_images (designer_id, image_url)
SELECT dp.id, url
FROM designer_profiles dp
CROSS JOIN (
  VALUES 
    ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'),
    ('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'),
    ('https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e'),
    ('https://images.unsplash.com/photo-1616137466211-f939a420be84'),
    ('https://images.unsplash.com/photo-1615529328331-f8917597711f')
) AS images(url)
WHERE dp.id IN (
  SELECT id FROM profiles WHERE email LIKE 'designer%@example.com'
);