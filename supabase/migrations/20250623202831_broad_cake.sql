/*
  # Fix RLS Policy for Profiles Table

  1. Security Updates
    - Drop existing INSERT policy that may be using incorrect function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure policy allows users to create their own profile during signup

  2. Changes
    - Replace INSERT policy with correct implementation
    - Maintain existing UPDATE and SELECT policies
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON profiles;

-- Create a new INSERT policy that allows users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the UPDATE policy uses the correct function (update if needed)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure the SELECT policy uses the correct function (update if needed)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);