/*
  # Add more test designers
  
  1. New Data
    - Adds 4 more designers with complete profiles
    - Adds portfolio images for each designer
  
  2. Changes
    - Inserts new designer profiles with services, pricing, etc
    - Adds corresponding portfolio images
*/

-- Insert new designers
WITH new_designers AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES 
    (gen_random_uuid(), 'designer1@example.com', now(), crypt('Password123!', gen_salt('bf'))),
    (gen_random_uuid(), 'designer3@example.com', now(), crypt('Password123!', gen_salt('bf'))),
    (gen_random_uuid(), 'designer4@example.com', now(), crypt('Password123!', gen_salt('bf'))),
    (gen_random_uuid(), 'designer5@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id, email
)
INSERT INTO profiles (id, email, role, name, email_verified)
SELECT 
  id,
  email,
  'designer',
  CASE email
    WHEN 'designer1@example.com' THEN 'Alex Thompson'
    WHEN 'designer3@example.com' THEN 'Nina Patel'
    WHEN 'designer4@example.com' THEN 'Lucas Wright'
    WHEN 'designer5@example.com' THEN 'Maria Santos'
  END,
  true
FROM new_designers
RETURNING id, email;



-- Insert designer profiles
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
    WHEN 'designer1@example.com' THEN 'Innovative designer blending Scandinavian simplicity with modern comfort.'
    WHEN 'designer3@example.com' THEN 'Specializing in luxurious yet sustainable interior designs.'
    WHEN 'designer4@example.com' THEN 'Creating bold, contemporary spaces with an artistic touch.'
    WHEN 'designer5@example.com' THEN 'Expert in Mediterranean and modern fusion designs.'
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb
    WHEN 'designer3@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb
    WHEN 'designer4@example.com' THEN '{"fullRoomDesign": true, "consultation": false, "eDesign": true}'::jsonb
    WHEN 'designer5@example.com' THEN '{"fullRoomDesign": true, "consultation": true, "eDesign": false}'::jsonb
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN '{"type": "fixed", "rate": 180}'::jsonb
    WHEN 'designer3@example.com' THEN '{"type": "hourly", "rate": 165}'::jsonb
    WHEN 'designer4@example.com' THEN '{"type": "fixed", "rate": 140}'::jsonb
    WHEN 'designer5@example.com' THEN '{"type": "hourly", "rate": 190}'::jsonb
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['Modern', 'Minimalist']::designer_style[]
    WHEN 'designer3@example.com' THEN ARRAY['Modern', 'Industrial']::designer_style[]
    WHEN 'designer4@example.com' THEN ARRAY['Industrial', 'Bohemian']::designer_style[]
    WHEN 'designer5@example.com' THEN ARRAY['Traditional', 'Modern']::designer_style[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['Living Room', 'Bedroom', 'Office']::room_type[]
    WHEN 'designer3@example.com' THEN ARRAY['Living Room', 'Kitchen', 'Office']::room_type[]
    WHEN 'designer4@example.com' THEN ARRAY['Living Room', 'Bedroom', 'Kitchen']::room_type[]
    WHEN 'designer5@example.com' THEN ARRAY['Kitchen', 'Living Room', 'Outdoor Spaces']::room_type[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 15
    WHEN 'designer3@example.com' THEN 165
    WHEN 'designer4@example.com' THEN 12
    WHEN 'designer5@example.com' THEN 190
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 'sqft'
    WHEN 'designer3@example.com' THEN 'hour'
    WHEN 'designer4@example.com' THEN 'sqft'
    WHEN 'designer5@example.com' THEN 'hour'
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 7
    WHEN 'designer3@example.com' THEN 9
    WHEN 'designer4@example.com' THEN 5
    WHEN 'designer5@example.com' THEN 11
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 4.7
    WHEN 'designer3@example.com' THEN 4.9
    WHEN 'designer4@example.com' THEN 4.6
    WHEN 'designer5@example.com' THEN 4.8
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN ARRAY['2D Layouts', '3D Renders']::portfolio_type[]
    WHEN 'designer3@example.com' THEN ARRAY['2D Layouts', '3D Renders']::portfolio_type[]
    WHEN 'designer4@example.com' THEN ARRAY['3D Renders']::portfolio_type[]
    WHEN 'designer5@example.com' THEN ARRAY['2D Layouts']::portfolio_type[]
  END,
  CASE p.email
    WHEN 'designer1@example.com' THEN 95
    WHEN 'designer3@example.com' THEN 120
    WHEN 'designer4@example.com' THEN 68
    WHEN 'designer5@example.com' THEN 145
  END,
  true
FROM profiles p
WHERE p.email IN (
  'designer1@example.com',
  'designer3@example.com',
  'designer4@example.com',
  'designer5@example.com'
);

-- Add portfolio images for new designers
INSERT INTO portfolio_images (designer_id, image_url)
SELECT dp.id, url
FROM designer_profiles dp
CROSS JOIN (
  VALUES 
    ('https://images.unsplash.com/photo-1618219944342-824e40a13285'),
    ('https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a'),
    ('https://images.unsplash.com/photo-1616486701797-0f33f61038df'),
    ('https://images.unsplash.com/photo-1616046229478-9901c5536a45'),
    ('https://images.unsplash.com/photo-1615876234886-fd9a39fda97f')
) AS images(url)
WHERE dp.id IN (
  SELECT id FROM profiles 
  WHERE email IN (
    'designer1@example.com',
    'designer3@example.com',
    'designer4@example.com',
    'designer5@example.com'
  )
);
