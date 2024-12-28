/*
  Add profiles for existing clients
*/

-- Insert into profiles table
INSERT INTO profiles (id, email, role, name, email_verified)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'emma.wilson@example.com', 'user', 'Emma Wilson', true),
  ('22222222-2222-2222-2222-222222222222', 'david.garcia@example.com', 'user', 'David Garcia', true),
  ('33333333-3333-3333-3333-333333333333', 'sarah.johnson@example.com', 'user', 'Sarah Johnson', true),
  ('44444444-4444-4444-4444-444444444444', 'michael.zhang@example.com', 'user', 'Michael Zhang', true),
  ('55555555-5555-5555-5555-555555555555', 'lisa.patel@example.com', 'user', 'Lisa Patel', true);
