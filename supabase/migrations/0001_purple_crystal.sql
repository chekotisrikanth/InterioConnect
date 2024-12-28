/*
  # Create profiles and approvals tables

  1. New Tables
    - `profiles`
      - Basic user profile information
      - Linked to auth.users
      - Includes role and verification status
    
    - `designer_profiles`
      - Extended profile for designers
      - Includes professional details and approval status
    
    - `designer_approvals`
      - Tracks designer approval requests
      - Includes admin feedback and approval status

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'designer', 'user')),
  name text NOT NULL,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create designer profiles table
CREATE TABLE IF NOT EXISTS designer_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  bio text,
  certifications text[],
  awards text[],
  services jsonb NOT NULL DEFAULT '{"fullRoomDesign": false, "consultation": false, "eDesign": false}'::jsonb,
  pricing jsonb NOT NULL DEFAULT '{"type": "fixed", "rate": 0}'::jsonb,
  is_approved boolean DEFAULT false,
  approval_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create designer approvals table
CREATE TABLE IF NOT EXISTS designer_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id uuid REFERENCES designer_profiles(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_feedback text,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_approvals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Designer profiles policies
CREATE POLICY "Public can read approved designer profiles"
  ON designer_profiles
  FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Designers can update own profile"
  ON designer_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Designer approvals policies
CREATE POLICY "Admins can read all approvals"
  ON designer_approvals
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can update approvals"
  ON designer_approvals
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));