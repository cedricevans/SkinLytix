-- Add category column to routine_products table to allow per-product category overrides
ALTER TABLE public.routine_products
ADD COLUMN category TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.routine_products.category IS 'User-specified product category override (face, body, hair, etc.)';