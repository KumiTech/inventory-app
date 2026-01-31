/*
  # Create Inventory Items Table

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `user_id` (uuid, foreign key) - References auth.users
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `quantity` (integer) - Stock quantity
      - `price` (numeric) - Product price
      - `category` (text) - Product category
      - `sku` (text) - Stock Keeping Unit
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policy for authenticated users to read their own items
    - Add policy for authenticated users to insert their own items
    - Add policy for authenticated users to update their own items
    - Add policy for authenticated users to delete their own items
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  quantity integer DEFAULT 0,
  price numeric(10, 2) DEFAULT 0,
  category text DEFAULT '',
  sku text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory items"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory items"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory items"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory items"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_created_at ON inventory_items(created_at DESC);