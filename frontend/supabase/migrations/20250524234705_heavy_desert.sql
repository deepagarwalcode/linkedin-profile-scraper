/*
  # Create leads table and enable RLS

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `industry` (text)
      - `organization` (text)
      - `position` (text)
      - `email` (text)
      - `phone` (text)
      - `percentage_match` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `leads` table
    - Add policies for authenticated users to manage their leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  organization text,
  position text,
  email text,
  phone text,
  percentage_match integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = auth.uid());