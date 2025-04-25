import { CategoriesClient } from './components/CategoriesClient';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types/category';

export const metadata: Metadata = {
  title: 'Categories | Vendora',
  description:
    'Browse products by category on Vendora - find everything you need for your home, office, or personal use.',
};

export default async function CategoriesPage() {
  // Create server-side Supabase client
  const supabase = await createClient();

  // Fetch all data in parallel
  const [categoriesRes, sellerProfilesRes, listingsRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('profiles')
      .select('seller_details')
      .eq('role', 'seller')
      .not('seller_details', 'is', null),
    supabase.from('listings').select('category'),
  ]);

  const categories = categoriesRes.data || [];
  const sellerProfiles = sellerProfilesRes.data || [];
  const listings = listingsRes.data || [];

  // Count businesses by category
  const businessCounts: Record<string, number> = {};
  sellerProfiles.forEach((profile) => {
    const businessCategory = profile.seller_details?.business_category;
    if (businessCategory) {
      businessCounts[businessCategory] =
        (businessCounts[businessCategory] || 0) + 1;
    }
  });

  // Count listings by category
  const listingCounts: Record<string, number> = {};
  listings.forEach((listing) => {
    if (listing.category) {
      listingCounts[listing.category] =
        (listingCounts[listing.category] || 0) + 1;
    }
  });

  // Enhance categories with count information
  const enhancedCategories = categories.map((category: Category) => ({
    ...category,
    businessCount: businessCounts[category.id] || 0,
    listingCount: listingCounts[category.id] || 0,
  }));

  return <CategoriesClient categories={enhancedCategories} />;
}
