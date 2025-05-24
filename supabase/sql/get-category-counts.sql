-- Function to get both business and listing counts for categories
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (
  category_id UUID,
  business_count BIGINT,
  listing_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH business_counts AS (
    SELECT 
      (seller_details->>'business_category')::UUID as category_id,
      COUNT(*) as count
    FROM profiles
    WHERE 
      role = 'seller'
      AND seller_details IS NOT NULL
      AND seller_details->>'business_category' IS NOT NULL
    GROUP BY seller_details->>'business_category'
  ),
  listing_counts AS (
    SELECT 
      category::UUID as category_id,
      COUNT(*) as count
    FROM listings
    WHERE category IS NOT NULL
    GROUP BY category
  )
  SELECT 
    c.id as category_id,
    COALESCE(bc.count, 0) as business_count,
    COALESCE(lc.count, 0) as listing_count
  FROM categories c
  LEFT JOIN business_counts bc ON c.id = bc.category_id
  LEFT JOIN listing_counts lc ON c.id = lc.category_id;
$$;

-- Grant access to the authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_category_counts() TO authenticated, anon;

-- Example usage:
-- SELECT c.*, cc.business_count, cc.listing_count
-- FROM categories c
-- LEFT JOIN get_category_counts() cc ON c.id = cc.category_id; 