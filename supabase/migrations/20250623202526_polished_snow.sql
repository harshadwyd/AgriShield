/*
  # Fix profiles table RLS policies

  1. Security Updates
    - Update INSERT policy to allow authenticated users to create their own profiles
    - Ensure proper RLS policies for profile creation during signup
    - Fix policy conditions to match auth.uid() properly

  2. Changes
    - Drop existing INSERT policy that may be too restrictive
    - Create new INSERT policy that allows authenticated users to insert their own profile
    - Ensure the policy uses proper auth.uid() function
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows authenticated users to create their own profile
CREATE POLICY "Enable insert for authenticated users based on user_id"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the profiles table has RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Also ensure we have proper SELECT policy for users to read their own profile
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