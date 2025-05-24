import { CategoriesClient } from './components/CategoriesClient';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

type CategoryCount = {
  category_id: string;
  business_count: number;
  listing_count: number;
};

export const metadata: Metadata = {
  title: 'Categories | Vendora',
  description:
    'Browse products by category on Vendora - find everything you need for your home, office, or personal use.',
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Get categories with counts using RPC function
  const [categoriesResponse, countsResponse] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.rpc('get_category_counts'),
  ]);

  if (categoriesResponse.error)
    throw new Error(categoriesResponse.error.message);
  if (countsResponse.error) throw new Error(countsResponse.error.message);

  const categories = categoriesResponse.data || [];
  const counts = (countsResponse.data as CategoryCount[]) || [];

  // Map and enhance categories with count information
  const enhancedCategories = categories.map((category) => {
    const categoryCount = counts.find(
      (count: CategoryCount) => count.category_id === category.id
    );
    return {
      ...category,
      businessCount: categoryCount?.business_count || 0,
      listingCount: categoryCount?.listing_count || 0,
    };
  });

  // Sort categories by total activity
  const sortedCategories = enhancedCategories.sort((a, b) => {
    // Compare total counts
    const aTotalCount = a.businessCount + a.listingCount;
    const bTotalCount = b.businessCount + b.listingCount;
    if (aTotalCount !== bTotalCount) {
      return bTotalCount - aTotalCount; // Descending order
    }

    // If total counts are equal, compare business counts
    if (a.businessCount !== b.businessCount) {
      return b.businessCount - a.businessCount;
    }

    // If business counts are equal, compare listing counts
    return b.listingCount - a.listingCount;
  });

  return <CategoriesClient categories={sortedCategories} />;
}
