-- Functions for counting businesses and listings by category

-- Function to count businesses by category
CREATE OR REPLACE FUNCTION get_business_counts_by_category()
RETURNS TABLE (category text, count text) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    seller_details->>'business_category' as category,
    COUNT(*)::text as count
  FROM profiles
  WHERE 
    role = 'seller'
    AND seller_details IS NOT NULL
    AND seller_details->>'business_category' IS NOT NULL
  GROUP BY seller_details->>'business_category';
$$;

-- Function to count listings by category
CREATE OR REPLACE FUNCTION get_listing_counts_by_category()
RETURNS TABLE (category text, count text)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    category,
    COUNT(*)::text as count
  FROM listings
  WHERE category IS NOT NULL
  GROUP BY category;
$$;

-- Grant access to the authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_business_counts_by_category() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_listing_counts_by_category() TO authenticated, anon; 