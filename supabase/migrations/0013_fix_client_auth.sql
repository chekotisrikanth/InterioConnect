-- First, clean up existing data in reverse order of dependencies
DELETE FROM chat_messages 
WHERE chat_id IN (
  SELECT id FROM client_designer_chats 
  WHERE client_id IN (
    SELECT id FROM client_profiles 
    WHERE email IN (
      'emma.wilson@example.com',
      'david.garcia@example.com',
      'sarah.johnson@example.com',
      'michael.zhang@example.com',
      'lisa.patel@example.com'
    )
  )
);

DELETE FROM client_designer_chats 
WHERE client_id IN (
  SELECT id FROM client_profiles 
  WHERE email IN (
    'emma.wilson@example.com',
    'david.garcia@example.com',
    'sarah.johnson@example.com',
    'michael.zhang@example.com',
    'lisa.patel@example.com'
  )
);

DELETE FROM designer_responses 
WHERE requirement_id IN (
  SELECT id FROM requirements 
  WHERE client_id IN (
    SELECT id FROM client_profiles 
    WHERE email IN (
      'emma.wilson@example.com',
      'david.garcia@example.com',
      'sarah.johnson@example.com',
      'michael.zhang@example.com',
      'lisa.patel@example.com'
    )
  )
);

DELETE FROM hired_designers 
WHERE client_id IN (
  SELECT id FROM client_profiles 
  WHERE email IN (
    'emma.wilson@example.com',
    'david.garcia@example.com',
    'sarah.johnson@example.com',
    'michael.zhang@example.com',
    'lisa.patel@example.com'
  )
);

DELETE FROM bookmarked_designers 
WHERE client_id IN (
  SELECT id FROM client_profiles 
  WHERE email IN (
    'emma.wilson@example.com',
    'david.garcia@example.com',
    'sarah.johnson@example.com',
    'michael.zhang@example.com',
    'lisa.patel@example.com'
  )
);

DELETE FROM requirements 
WHERE client_id IN (
  SELECT id FROM client_profiles 
  WHERE email IN (
    'emma.wilson@example.com',
    'david.garcia@example.com',
    'sarah.johnson@example.com',
    'michael.zhang@example.com',
    'lisa.patel@example.com'
  )
);

DELETE FROM client_notifications 
WHERE client_id IN (
  SELECT id FROM client_profiles 
  WHERE email IN (
    'emma.wilson@example.com',
    'david.garcia@example.com',
    'sarah.johnson@example.com',
    'michael.zhang@example.com',
    'lisa.patel@example.com'
  )
);

DELETE FROM client_profiles WHERE email IN (
  'emma.wilson@example.com',
  'david.garcia@example.com',
  'sarah.johnson@example.com',
  'michael.zhang@example.com',
  'lisa.patel@example.com'
);

DELETE FROM profiles WHERE email IN (
  'emma.wilson@example.com',
  'david.garcia@example.com',
  'sarah.johnson@example.com',
  'michael.zhang@example.com',
  'lisa.patel@example.com'
);

DELETE FROM auth.users WHERE email IN (
  'emma.wilson@example.com',
  'david.garcia@example.com',
  'sarah.johnson@example.com',
  'michael.zhang@example.com',
  'lisa.patel@example.com'
);

-- Note: Create users through Supabase Auth UI first, then run this migration to add their profiles

-- Add profiles for users created through Supabase Auth UI
INSERT INTO profiles (id, email, role, name, email_verified)
SELECT 
  id,
  email,
  'user',
  CASE email
    WHEN 'emma.wilson@example.com' THEN 'Emma Wilson'
    WHEN 'david.garcia@example.com' THEN 'David Garcia'
    WHEN 'sarah.johnson@example.com' THEN 'Sarah Johnson'
    WHEN 'michael.zhang@example.com' THEN 'Michael Zhang'
    WHEN 'lisa.patel@example.com' THEN 'Lisa Patel'
  END,
  true
FROM auth.users
WHERE email IN (
  'emma.wilson@example.com',
  'david.garcia@example.com',
  'sarah.johnson@example.com',
  'michael.zhang@example.com',
  'lisa.patel@example.com'
);

-- Add client profiles
INSERT INTO client_profiles (id, full_name, email, preferred_styles, preferred_budget_range, location)
SELECT 
  id,
  name,
  email,
  CASE email
    WHEN 'emma.wilson@example.com' THEN ARRAY['Modern', 'Minimalist']::designer_style[]
    WHEN 'david.garcia@example.com' THEN ARRAY['Industrial', 'Modern']::designer_style[]
    WHEN 'sarah.johnson@example.com' THEN ARRAY['Traditional', 'Rustic']::designer_style[]
    WHEN 'michael.zhang@example.com' THEN ARRAY['Modern', 'Industrial']::designer_style[]
    WHEN 'lisa.patel@example.com' THEN ARRAY['Bohemian', 'Traditional']::designer_style[]
  END,
  CASE email
    WHEN 'emma.wilson@example.com' THEN '[50000,75000]'::int4range
    WHEN 'david.garcia@example.com' THEN '[30000,50000]'::int4range
    WHEN 'sarah.johnson@example.com' THEN '[75000,100000]'::int4range
    WHEN 'michael.zhang@example.com' THEN '[100000,150000]'::int4range
    WHEN 'lisa.patel@example.com' THEN '[40000,60000]'::int4range
  END,
  CASE email
    WHEN 'emma.wilson@example.com' THEN 'San Francisco, CA'
    WHEN 'david.garcia@example.com' THEN 'Austin, TX'
    WHEN 'sarah.johnson@example.com' THEN 'Boston, MA'
    WHEN 'michael.zhang@example.com' THEN 'Seattle, WA'
    WHEN 'lisa.patel@example.com' THEN 'Denver, CO'
  END
FROM profiles
WHERE email IN (
  'emma.wilson@example.com',
  'david.garcia@example.com',
  'sarah.johnson@example.com',
  'michael.zhang@example.com',
  'lisa.patel@example.com'
)

SELECT 'Migration complete' as status;
