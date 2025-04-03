/*
  # Password Vault Schema

  1. New Tables
    - `passwords`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `username` (text)
      - `encrypted_password` (text)
      - `url` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `passwords` table
    - Add policies for CRUD operations
    - Only allow users to access their own passwords
*/

-- Create passwords table
CREATE TABLE IF NOT EXISTS passwords (
                                         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    username text NOT NULL,
    encrypted_password text NOT NULL,
    url text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- Enable RLS
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own password entries"
  ON passwords
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own passwords"
  ON passwords
  FOR SELECT
                        TO authenticated
                        USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own passwords"
  ON passwords
  FOR UPDATE
                 TO authenticated
                 USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passwords"
  ON passwords
  FOR DELETE
TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_passwords_updated_at
    BEFORE UPDATE ON passwords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();