/*
  # Fix admin user setup

  1. Changes
    - Ensures admin user exists with correct password
    - Updates profile with correct role
    - Adds necessary metadata
*/

-- First, ensure the admin user exists with correct password
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  'ad3e1700-0101-4b99-9999-123456789012',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@interiormatch.com',
  -- Password: Admin123! (generated with proper Supabase auth hash)
  crypt('Admin123!', gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email']),
  jsonb_build_object('role', 'admin'),
  now(),
  now()
) ON CONFLICT (id) DO 
  UPDATE SET 
    encrypted_password = excluded.encrypted_password,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

-- Ensure admin profile exists with correct role
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
) ON CONFLICT (id) DO 
  UPDATE SET 
    role = 'admin',
    email_verified = true,
    updated_at = now();