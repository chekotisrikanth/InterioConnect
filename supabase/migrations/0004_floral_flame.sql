/*
  # Create admin user

  1. Changes
    - Creates admin user with proper password hash
    - Sets up admin profile
*/

-- Create admin user with proper password hash
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ad3e1700-0101-4b99-9999-123456789012',
  'authenticated',
  'authenticated',
  'admin@interiormatch.com',
  '$2a$10$RQmr2lHGrLFHoFCxYUXOo.1Yw3nNm0Zz7cOsHBNPm2GZUh4qvDk.2',  -- Password: Admin123!
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile if it doesn't exist
INSERT INTO profiles (
  id,
  email,
  role,
  name,
  email_verified
) VALUES (
  'ad3e1700-0101-4b99-9999-123456789012',
  'admin@interiormatch.com',
  'admin',
  'System Admin',
  true
) ON CONFLICT (id) DO NOTHING;