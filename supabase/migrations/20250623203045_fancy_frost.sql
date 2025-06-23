/*
  # Fix profiles table RLS policy for user registration

  1. Security Updates
    - Drop existing RLS policies that may have incorrect function references
    - Create new RLS policies with correct auth.uid() function calls
    - Ensure authenticated users can insert their own profile data during sign-up

  2. Policy Details
    - INSERT policy: Allow authenticated users to create their own profile
    - SELECT policy: Allow users to view their own profile data
    - UPDATE policy: Allow users to update their own profile data
*/

-- Drop existing policies to recreate them with correct syntax
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create INSERT policy for authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create SELECT policy for users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create UPDATE policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;