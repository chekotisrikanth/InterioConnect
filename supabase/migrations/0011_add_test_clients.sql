/*
  Add test client data
*/

-- Insert test clients into auth.users first (required for foreign key constraints)
INSERT INTO auth.users (id, email, encrypted_password, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'emma.wilson@example.com', crypt('password123', gen_salt('bf')), now()),
  ('22222222-2222-2222-2222-222222222222', 'david.garcia@example.com', crypt('password123', gen_salt('bf')), now()),
  ('33333333-3333-3333-3333-333333333333', 'sarah.johnson@example.com', crypt('password123', gen_salt('bf')), now()),
  ('44444444-4444-4444-4444-444444444444', 'michael.zhang@example.com', crypt('password123', gen_salt('bf')), now()),
  ('55555555-5555-5555-5555-555555555555', 'lisa.patel@example.com', crypt('password123', gen_salt('bf')), now());

-- Insert into profiles table
INSERT INTO profiles (id, email, role, name, email_verified)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'emma.wilson@example.com', 'user', 'Emma Wilson', true),
  ('22222222-2222-2222-2222-222222222222', 'david.garcia@example.com', 'user', 'David Garcia', true),
  ('33333333-3333-3333-3333-333333333333', 'sarah.johnson@example.com', 'user', 'Sarah Johnson', true),
  ('44444444-4444-4444-4444-444444444444', 'michael.zhang@example.com', 'user', 'Michael Zhang', true),
  ('55555555-5555-5555-5555-555555555555', 'lisa.patel@example.com', 'user', 'Lisa Patel', true);

-- Insert client profiles
INSERT INTO client_profiles (id, full_name, email, preferred_styles, preferred_budget_range, location)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Emma Wilson',
    'emma.wilson@example.com',
    ARRAY['Modern', 'Minimalist']::designer_style[],
    '[50000,75000]',
    'San Francisco, CA'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'David Garcia',
    'david.garcia@example.com',
    ARRAY['Industrial', 'Modern']::designer_style[],
    '[30000,50000]',
    'Austin, TX'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Sarah Johnson',
    'sarah.johnson@example.com',
    ARRAY['Traditional', 'Rustic']::designer_style[],
    '[75000,100000]',
    'Boston, MA'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Michael Zhang',
    'michael.zhang@example.com',
    ARRAY['Modern', 'Industrial']::designer_style[],
    '[100000,150000]',
    'Seattle, WA'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Lisa Patel',
    'lisa.patel@example.com',
    ARRAY['Bohemian', 'Traditional']::designer_style[],
    '[40000,60000]',
    'Denver, CO'
  );

-- Insert requirements
INSERT INTO requirements (
  client_id,
  title,
  room_type,
  preferred_style,
  budget_range,
  description,
  location,
  timeline_start,
  timeline_end
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Modern Home Office Redesign',
    'Office',
    'Modern',
    '[15000,25000]',
    'Looking to create a minimalist home office space that maximizes productivity and incorporates smart storage solutions.',
    'San Francisco, CA',
    '2024-03-01',
    '2024-05-01'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Industrial Style Living Room',
    'Living Room',
    'Industrial',
    '[20000,35000]',
    'Want to transform my living room into an industrial-style space with exposed brick, metal elements, and vintage furniture.',
    'Austin, TX',
    '2024-04-01',
    '2024-06-15'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Traditional Kitchen Renovation',
    'Kitchen',
    'Traditional',
    '[40000,60000]',
    'Seeking to renovate my kitchen with classic design elements, custom cabinetry, and high-end appliances.',
    'Boston, MA',
    '2024-05-01',
    '2024-08-01'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Modern Master Bedroom Suite',
    'Bedroom',
    'Modern',
    '[30000,45000]',
    'Planning to redesign master bedroom with modern aesthetics, including custom lighting and built-in storage.',
    'Seattle, WA',
    '2024-03-15',
    '2024-06-01'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Bohemian Outdoor Patio Design',
    'Outdoor Spaces',
    'Bohemian',
    '[10000,20000]',
    'Looking to create a cozy outdoor living space with bohemian elements, including comfortable seating and natural materials.',
    'Denver, CO',
    '2024-04-15',
    '2024-05-15'
  );

-- Add some bookmarked designers
INSERT INTO bookmarked_designers (client_id, designer_id)
SELECT 
  client_id,
  designer_id
FROM (
  SELECT id as client_id FROM client_profiles WHERE email = 'emma.wilson@example.com'
) c
CROSS JOIN (
  SELECT id as designer_id FROM designer_profiles WHERE id IN (
    SELECT id FROM profiles WHERE email IN ('sofia.chen@example.com', 'james.kim@example.com')
  )
) d;

INSERT INTO bookmarked_designers (client_id, designer_id)
SELECT 
  client_id,
  designer_id
FROM (
  SELECT id as client_id FROM client_profiles WHERE email = 'david.garcia@example.com'
) c
CROSS JOIN (
  SELECT id as designer_id FROM designer_profiles WHERE id IN (
    SELECT id FROM profiles WHERE email IN ('marcus.rodriguez@example.com')
  )
) d;

INSERT INTO bookmarked_designers (client_id, designer_id)
SELECT 
  client_id,
  designer_id
FROM (
  SELECT id as client_id FROM client_profiles WHERE email = 'sarah.johnson@example.com'
) c
CROSS JOIN (
  SELECT id as designer_id FROM designer_profiles WHERE id IN (
    SELECT id FROM profiles WHERE email IN ('isabella.martinez@example.com', 'olivia.thompson@example.com')
  )
) d;
