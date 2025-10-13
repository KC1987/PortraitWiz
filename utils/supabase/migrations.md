# Supabase Migrations

## Database Tables

### generated_images
**Purpose:** Store user-generated images for dashboard display

**SQL:**
```sql
CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_base64 text NOT NULL,
  prompt text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own images
CREATE POLICY "Users can view own images"
  ON generated_images
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own images
CREATE POLICY "Users can insert own images"
  ON generated_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON generated_images
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Location:** Run this in Supabase SQL Editor

## Database Functions

### increment_credits
**Purpose:** Atomically increment user credits (used in Stripe webhook)

**SQL:**
```sql
CREATE OR REPLACE FUNCTION increment_credits(user_id uuid, amount int)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```ts
await supabase.rpc('increment_credits', {
  user_id: metadata.userId,
  amount: Number(metadata.tokens)
});
```

**Location:** Run this in Supabase SQL Editor

### deduct_credits
**Purpose:** Atomically deduct user credits and return new balance

**SQL:**
```sql
CREATE OR REPLACE FUNCTION deduct_credits(user_id uuid, amount int)
RETURNS int AS $$
DECLARE
  new_credits int;
BEGIN
  UPDATE profiles
  SET credits = credits - amount
  WHERE id = user_id
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```ts
const { data, error } = await supabase.rpc('deduct_credits', {
  user_id: userId,
  amount: creditsToDeduct
});
// data contains the new credits value
```

**Location:** Run this in Supabase SQL Editor

### contact_messages
**Purpose:** Store contact form submissions from users

**SQL:**
```sql
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add index for faster queries by date
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Add index for email lookups
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated admins can view contact messages
-- (Adjust this based on your admin setup)
CREATE POLICY "Only service role can view contact messages"
  ON contact_messages
  FOR SELECT
  USING (false); -- By default, no one can read. Use service role key for admin access.
```

**Location:** Run this in Supabase SQL Editor