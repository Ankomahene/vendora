import { createClient } from '@/lib/supabase/client';
import { UserProfile, Listing, Location } from '@/lib/types';
import { Category } from '@/lib/types/category';

export interface SearchParams {
  searchType: 'sellers' | 'listings' | 'categories' | 'product_types';
  query?: string;
  category?: string;
  productType?: string;
  serviceMode?: string;
  priceRange?: [number, number];
  distance?: number;
  location?: Location;
  sortBy?: 'relevance' | 'proximity' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  sellers: UserProfile[];
  listings: Listing[];
  categories: Category[];
  productTypes: { id: string; name: string }[];
  totalResults: number;
}

export async function searchItems({
  searchType = 'sellers',
  query = '',
  category = '',
  productType = '',
  serviceMode = '',
  priceRange = [0, Infinity],
  //   distance = 50,
  //   location,
  sortBy = 'relevance',
  page = 1,
  limit = 10,
}: SearchParams): Promise<SearchResult> {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  // Initialize empty result
  const result: SearchResult = {
    sellers: [],
    listings: [],
    categories: [],
    productTypes: [],
    totalResults: 0,
  };

  try {
    // Search based on the type
    if (searchType === 'sellers') {
      let sellersQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'seller')
        .eq('seller_status', 'approved');

      if (query) {
        sellersQuery = sellersQuery.or(
          `seller_details->business_name.ilike.%${query}%,seller_details->description.ilike.%${query}%`
        );
      }

      if (category) {
        sellersQuery = sellersQuery.filter(
          'seller_details',
          'cs',
          JSON.stringify({ business_category: category })
        );
      }

      if (serviceMode) {
        // For JSON array containing objects, we need a different approach
        // This will find sellers where any service_mode in the array matches the type and is enabled
        sellersQuery = sellersQuery.filter(
          'seller_details->service_modes',
          'cs',
          JSON.stringify([{ type: serviceMode, enabled: true }])
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          sellersQuery = sellersQuery.order('created_at', { ascending: false });
          break;
        // Other sorting options would be implemented here
        default:
          sellersQuery = sellersQuery.order('created_at', { ascending: false });
      }

      const { data: sellers, count } = await sellersQuery.range(
        offset,
        offset + limit - 1
      );

      result.sellers = (sellers as UserProfile[]) || [];
      result.totalResults = count || 0;
    } else if (searchType === 'listings') {
      let listingsQuery = supabase
        .from('listings')
        .select('*, seller:seller_id(*)', { count: 'exact' })
        .eq('is_active', true);

      if (query) {
        listingsQuery = listingsQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      if (category) {
        listingsQuery = listingsQuery.eq('category', category);
      }

      if (productType) {
        listingsQuery = listingsQuery.eq('product_type', productType);
      }

      if (serviceMode) {
        listingsQuery = listingsQuery.contains('service_modes', [serviceMode]);
      }

      if (priceRange && priceRange[0] !== 0 && priceRange[1] !== Infinity) {
        listingsQuery = listingsQuery
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          listingsQuery = listingsQuery.order('created_at', {
            ascending: false,
          });
          break;
        case 'price_asc':
          listingsQuery = listingsQuery.order('price', { ascending: true });
          break;
        case 'price_desc':
          listingsQuery = listingsQuery.order('price', { ascending: false });
          break;
        default:
          listingsQuery = listingsQuery.order('created_at', {
            ascending: false,
          });
      }

      const { data: listings, count } = await listingsQuery.range(
        offset,
        offset + limit - 1
      );

      result.listings = (listings as Listing[]) || [];
      result.totalResults = count || 0;
    } else if (searchType === 'categories') {
      let categoriesQuery = supabase
        .from('categories')
        .select('*', { count: 'exact' });

      if (query) {
        categoriesQuery = categoriesQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      categoriesQuery = categoriesQuery.order('name');

      const { data: categories, count } = await categoriesQuery.range(
        offset,
        offset + limit - 1
      );

      result.categories = (categories as Category[]) || [];
      result.totalResults = count || 0;
    } else if (searchType === 'product_types') {
      let productTypesQuery = supabase
        .from('product_types')
        .select('*', { count: 'exact' });

      if (query) {
        productTypesQuery = productTypesQuery.ilike('name', `%${query}%`);
      }

      productTypesQuery = productTypesQuery.order('name');

      const { data: productTypes, count } = await productTypesQuery.range(
        offset,
        offset + limit - 1
      );

      result.productTypes =
        (productTypes as { id: string; name: string }[]) || [];
      result.totalResults = count || 0;
    }

    return result;
  } catch (error) {
    console.error('Search error:', error);
    return result;
  }
}
