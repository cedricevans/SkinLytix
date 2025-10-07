-- Fix foreign key constraint to allow easy user deletion during beta testing
-- This will set contributed_by_user_id to NULL when a user is deleted
-- rather than blocking the deletion

-- Drop existing constraint
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_contributed_by_user_id_fkey;

-- Recreate with ON DELETE SET NULL to allow user deletion
ALTER TABLE products
ADD CONSTRAINT products_contributed_by_user_id_fkey 
FOREIGN KEY (contributed_by_user_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL;