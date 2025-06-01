/*
  # Add user ID column and fix RLS policy

  1. Changes
    - Add `uid` column to `leads` table to track ownership
    - Update RLS policy to properly handle all operations including inserts
    
  2. Security
    - Enable RLS (already enabled)
    - Update policy to use proper user ID checks
    - Ensure authenticated users can only manage their own leads
*/

-- Add uid column
ALTER TABLE leads 
ADD COLUMN uid UUID DEFAULT auth.uid() NOT NULL;

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own leads" ON leads;

-- Create new comprehensive policy
CREATE POLICY "Enable all operations for users based on user_id" ON leads
FOR ALL
TO authenticated
USING (auth.uid() = uid)
WITH CHECK (auth.uid() = uid);