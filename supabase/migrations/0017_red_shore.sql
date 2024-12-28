/*
  # Add Designer Records

  1. New Records
    - Add profiles for designers
    - Add designer profiles with portfolio and services
    - Add portfolio images
  
  2. Data
    - 5 designers with complete profiles
    - Portfolio images for each designer
    - Services and pricing information
*/

-- Add profiles for designers
INSERT INTO profiles (id, email, role, name, email_verified)
SELECT 
  auth.id,
  auth.email,
  'designer',
  CASE auth.email
    WHEN 'designer1@example.com' THEN 'Sarah Anderson'
    WHEN 'designer2@example.com' THEN 'Michael Chen'
    WHEN 'designer3@example.com' THEN 'Emma Roberts'
    WHEN 'designer4@example.com' THEN 'David Wilson'
    WHEN 'designer5@example.com' THEN 'Sofia Martinez'
  END,
  true
FROM auth.users auth
WHERE auth.email LIKE 'designer%@example.com'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'designer',
  name = EXCLUDED.name;

-- Add designer profiles
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
  CASE p.email
    WHEN 'designer1@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb
    WHEN 'designer2@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": false}'::jsonb
    WHEN 'designer3@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb
    WHEN 'designer4@example.com' THEN '{"fullRoomDesign": true, "consultation": false, "eDesign": true}'::jsonb
    WHEN 'designer5@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN '{"type": "fixed", "rate": 150}'::jsonb
    WHEN 'designer2@example.com' THEN '{"type": "hourly", "rate": 200}'::jsonb
    WHEN 'designer3@example.com' THEN '{"type": "fixed", "rate": 125}'::jsonb
    WHEN 'designer4@example.com' THEN '{"type": "hourly", "rate": 175}'::jsonb
    WHEN 'designer5@example.com' THEN '{"type": "fixed", "rate": 160}'::jsonb
  END,
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
WHERE p.email LIKE 'designer%@example.com'
ON CONFLICT (id) DO UPDATE
SET 
  bio = EXCLUDED.bio,
  services = EXCLUDED.services,
  pricing = EXCLUDED.pricing,
  styles = EXCLUDED.styles,
  room_types = EXCLUDED.room_types,
  price_per_unit = EXCLUDED.price_per_unit,
  price_unit = EXCLUDED.price_unit,
  experience_level = EXCLUDED.experience_level,
  rating = EXCLUDED.rating,
  portfolio_types = EXCLUDED.portfolio_types,
  completed_projects = EXCLUDED.completed_projects,
  is_approved = EXCLUDED.is_approved;

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
)
ON CONFLICT DO NOTHING;