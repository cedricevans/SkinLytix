-- Add product_price to user_analyses table
ALTER TABLE user_analyses 
ADD COLUMN product_price NUMERIC;

-- Migrate existing prices from routine_products to user_analyses
-- This preserves all existing price data before the architecture change
WITH first_prices AS (
  SELECT DISTINCT ON (analysis_id) 
    analysis_id,
    product_price
  FROM routine_products
  WHERE product_price IS NOT NULL AND product_price > 0
  ORDER BY analysis_id, created_at ASC
)
UPDATE user_analyses ua
SET product_price = fp.product_price
FROM first_prices fp
WHERE ua.id = fp.analysis_id
  AND ua.product_price IS NULL;

-- Add helpful comment
COMMENT ON COLUMN user_analyses.product_price IS 
  'User-entered price for this product. Preserved even when removed from routines.';