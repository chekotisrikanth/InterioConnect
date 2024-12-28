/*
  # Create initial admin user

  1. Creates the first admin user
  2. Sets up admin profile
*/

-- Insert admin user (password: Admin@123)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
) VALUES (
  'ad3e1700-0101-4b99-9999-123456789012',
  'admin@interiormatch.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345', -- Admin@123
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW(),
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
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