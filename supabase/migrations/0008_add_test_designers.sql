/*
  # Add test designers and portfolio images

  1. Changes
    - Create portfolio_images table
    - Add 5 test designers with complete profiles
    - Add portfolio images for each designer
*/

-- Create portfolio_images table
CREATE TABLE IF NOT EXISTS portfolio_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id uuid REFERENCES designer_profiles(id) NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on portfolio_images
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for portfolio_images
CREATE POLICY "Public can view portfolio images"
  ON portfolio_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert test designers
-- 1. Sofia Chen
WITH new_auth_user AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES (uuid_generate_v4(), 'sofia.chen@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id
), new_profile AS (
  INSERT INTO profiles (id, email, role, name, email_verified)
  SELECT id, 'sofia.chen@example.com', 'designer', 'Sofia Chen', true
  FROM new_auth_user
  RETURNING id
)
INSERT INTO designer_profiles (id, bio, services, pricing, is_approved, approval_date)
SELECT id,
  'Luxury interior designer with a passion for creating sophisticated, contemporary spaces that blend comfort with elegance.',
  '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb,
  '{"type": "hourly", "rate": 150}'::jsonb,
  true,
  now()
FROM new_profile
RETURNING id;

-- 2. Marcus Rodriguez
WITH new_auth_user AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES (uuid_generate_v4(), 'marcus.rodriguez@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id
), new_profile AS (
  INSERT INTO profiles (id, email, role, name, email_verified)
  SELECT id, 'marcus.rodriguez@example.com', 'designer', 'Marcus Rodriguez', true
  FROM new_auth_user
  RETURNING id
)
INSERT INTO designer_profiles (id, bio, services, pricing, is_approved, approval_date)
SELECT id,
  'Specializing in urban modern designs with an industrial edge, creating bold and functional living spaces.',
  '{"fullRoomDesign": true, "consultation": true, "eDesign": false}'::jsonb,
  '{"type": "fixed", "rate": 2500}'::jsonb,
  true,
  now()
FROM new_profile
RETURNING id;

-- 3. Olivia Thompson
WITH new_auth_user AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES (uuid_generate_v4(), 'olivia.thompson@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id
), new_profile AS (
  INSERT INTO profiles (id, email, role, name, email_verified)
  SELECT id, 'olivia.thompson@example.com', 'designer', 'Olivia Thompson', true
  FROM new_auth_user
  RETURNING id
)
INSERT INTO designer_profiles (id, bio, services, pricing, is_approved, approval_date)
SELECT id,
  'Award-winning designer known for creating bright, airy coastal spaces that bring the beach lifestyle indoors.',
  '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb,
  '{"type": "hourly", "rate": 175}'::jsonb,
  true,
  now()
FROM new_profile
RETURNING id;

-- 4. James Kim
WITH new_auth_user AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES (uuid_generate_v4(), 'james.kim@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id
), new_profile AS (
  INSERT INTO profiles (id, email, role, name, email_verified)
  SELECT id, 'james.kim@example.com', 'designer', 'James Kim', true
  FROM new_auth_user
  RETURNING id
)
INSERT INTO designer_profiles (id, bio, services, pricing, is_approved, approval_date)
SELECT id,
  'Passionate about creating zen-like spaces that combine Japanese aesthetics with modern minimalism.',
  '{"fullRoomDesign": true, "consultation": true, "eDesign": true}'::jsonb,
  '{"type": "fixed", "rate": 3000}'::jsonb,
  true,
  now()
FROM new_profile
RETURNING id;

-- 5. Isabella Martinez
WITH new_auth_user AS (
  INSERT INTO auth.users (id, email, email_confirmed_at, encrypted_password)
  VALUES (uuid_generate_v4(), 'isabella.martinez@example.com', now(), crypt('Password123!', gen_salt('bf')))
  RETURNING id
), new_profile AS (
  INSERT INTO profiles (id, email, role, name, email_verified)
  SELECT id, 'isabella.martinez@example.com', 'designer', 'Isabella Martinez', true
  FROM new_auth_user
  RETURNING id
)
INSERT INTO designer_profiles (id, bio, services, pricing, is_approved, approval_date)
SELECT id,
  'Bringing Mediterranean warmth and elegance to modern spaces with a focus on timeless design principles.',
  '{"fullRoomDesign": true, "consultation": true, "eDesign": false}'::jsonb,
  '{"type": "hourly", "rate": 160}'::jsonb,
  true,
  now()
FROM new_profile
RETURNING id;

-- Add portfolio images for each designer
INSERT INTO portfolio_images (designer_id, image_url)
SELECT dp.id, url
FROM designer_profiles dp
CROSS JOIN (
  VALUES 
    ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'),
    ('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'),
    ('https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e')
) AS images(url)
WHERE dp.id IN (
  SELECT id FROM designer_profiles 
  WHERE id IN (
    SELECT id FROM profiles 
    WHERE email IN (
      'sofia.chen@example.com',
      'marcus.rodriguez@example.com',
      'olivia.thompson@example.com',
      'james.kim@example.com',
      'isabella.martinez@example.com'
    )
  )
);
