/*
  # Fix admin authentication

  1. Changes
    - Ensures admin user exists with correct password and metadata
    - Updates profile with correct role and verified status
    - Handles foreign key constraints properly
*/

-- First, delete existing records in the correct order to respect foreign key constraints
DELETE FROM designer_approvals WHERE designer_id = 'ad3e1700-0101-4b99-9999-123456789012';
DELETE FROM designer_profiles WHERE id = 'ad3e1700-0101-4b99-9999-123456789012';
DELETE FROM profiles WHERE id = 'ad3e1700-0101-4b99-9999-123456789012';
DELETE FROM auth.users WHERE id = 'ad3e1700-0101-4b99-9999-123456789012';

-- Create admin user with correct password and metadata
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
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
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  now(),
  now()
);

-- Create admin profile
INSERT INTO profiles (
  id,
  email,
  role,
  name,
  email_verified,
  created_at,
  updated_at
) VALUES (
  'ad3e1700-0101-4b99-9999-123456789012',
  'admin@interiormatch.com',
  'admin',
  'System Admin',
  true,
  now(),
  now()
);