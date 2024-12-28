/*
  # Update admin role

  1. Changes
    - Updates the role of admin@interiormatch.com user to 'admin'
*/

DO $$
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = 'admin@interiormatch.com';
END $$;