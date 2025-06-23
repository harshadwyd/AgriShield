/*
  # Fix profiles table RLS policy for user registration

  1. Security Updates
    - Update INSERT policy to allow authenticated users to create their own profiles
    - Ensure the policy uses the correct auth.uid() function
    - Add proper policy for profile creation during sign-up

  2. Changes
    - Drop existing INSERT policy if it exists
    - Create new INSERT policy that properly handles user registration
    - Ensure the policy allows users to insert their own profile data
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new INSERT policy that allows authenticated users to create their own profiles
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the profiles table has RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Also ensure we have a proper SELECT policy for users to read their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure UPDATE policy exists and is correct
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);