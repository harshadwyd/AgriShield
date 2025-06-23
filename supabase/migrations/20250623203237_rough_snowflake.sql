/*
  # Fix RLS Policy for Profile Creation

  1. Security Updates
    - Update INSERT policy for profiles table to allow authenticated users to create their own profile
    - Ensure the policy correctly references the authenticated user's ID
    - Fix any issues with the existing RLS policies

  2. Changes
    - Drop and recreate the INSERT policy with correct permissions
    - Ensure the policy allows users to insert their own profile data
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the SELECT policy exists and is correct
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure the UPDATE policy exists and is correct
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);