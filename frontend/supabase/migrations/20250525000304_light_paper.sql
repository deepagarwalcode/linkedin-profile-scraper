/*
  # Add admin role and update policies

  1. Changes
    - Add admin role to auth.users
    - Update RLS policies to allow admins full access
    - Allow regular users read-only access
    
  2. Security
    - Admins can perform all operations
    - Regular users can only read and search leads
*/

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policy
DROP POLICY IF EXISTS "Enable all operations for users based on user_id" ON leads;

-- Create admin policy for full access
CREATE POLICY "Enable all operations for admins"
ON leads
FOR ALL
TO authenticated
USING (is_admin() = true)
WITH CHECK (is_admin() = true);

-- Create read-only policy for regular users
CREATE POLICY "Enable read access for all authenticated users"
ON leads
FOR SELECT
TO authenticated
USING (true);