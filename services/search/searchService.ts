import { createClient } from '@/lib/supabase/client';
import { UserProfile, Location } from '@/lib/types';
import { Listing } from '@/app/dashboard/listings/types';
import { Category } from '@/lib/types/category';
import { calculateDistance } from '@/lib/utils';
import { SupabaseClient } from '@supabase/supabase-js';

export type SearchType =
  | 'sellers'
  | 'listings'
  | 'categories'
  | 'product_types';

export type SortByType =
  | 'relevance'
  | 'proximity'
  | 'newest'
  | 'price_asc'
  | 'price_desc';

export interface SearchParams {
  searchType: SearchType;
  query?: string;
  category?: string;
  productType?: string;
  serviceMode?: string;
  priceRange?: [number, number];
  distance?: number;
  location?: Location | null;
  sortBy?: SortByType;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  sellers: (UserProfile & { distanceFromUser?: number | null })[];
  listings: (Listing & { distanceFromUser?: number | null })[];
  categories: Category[];
  productTypes: { id: string; name: string }[];
  totalResults: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Type alias for Supabase query builder - using any here as the full type is complex
type QueryBuilder = ReturnType<typeof buildBaseSellersQuery>;

// Main search function that delegates to specific search functions
export async function searchItems(params: SearchParams): Promise<SearchResult> {
  const { searchType = 'sellers' } = params;

  // Replace any 'all' values with empty strings
  const cleanedParams: SearchParams = {
    ...params,
    category: params.category === 'all' ? '' : params.category,
    productType: params.productType === 'all' ? '' : params.productType,
    serviceMode: params.serviceMode === 'all' ? '' : params.serviceMode,
  };

  // Initialize empty result
  const result: SearchResult = {
    sellers: [],
    listings: [],
    categories: [],
    productTypes: [],
    totalResults: 0,
  };

  const supabase = createClient();

  try {
    // Delegate to specific search function based on searchType
    switch (searchType) {
      case 'sellers':
        return await searchSellers(supabase, cleanedParams, result);
      case 'listings':
        return await searchListings(supabase, cleanedParams, result);
      case 'categories':
        return await searchCategories(supabase, cleanedParams, result);
      case 'product_types':
        return await searchProductTypes(supabase, cleanedParams, result);
      default:
        return result;
    }
  } catch (error) {
    console.error('Search error:', error);
    return result;
  }
}

// ===== SELLER SEARCH FUNCTIONS =====

async function searchSellers(
  supabase: SupabaseClient,
  params: SearchParams,
  result: SearchResult
): Promise<SearchResult> {
  const {
    query = '',
    category = '',
    serviceMode = '',
    distance = 0,
    location,
    sortBy = 'relevance',
    page = 1,
    limit = 10,
  } = params;

  const offset = calculateOffset(page, limit);

  // Build base sellers query
  let sellersQuery = buildBaseSellersQuery(supabase);

  // Apply text search filters
  sellersQuery = applySellerTextSearch(sellersQuery, query);

  // Apply category filter
  sellersQuery = applySellerCategoryFilter(sellersQuery, category);

  // Apply service mode filter
  sellersQuery = applySellerServiceModeFilter(sellersQuery, serviceMode);

  // Apply sorting
  sellersQuery = applySortingToSellersQuery(sellersQuery, sortBy);

  // Execute query with pagination
  const { data: sellers, count } = await sellersQuery.range(
    offset,
    offset + limit - 1
  );

  // Process location-based filtering
  if (location?.lat && location?.lng) {
    const processedSellers = processSellerLocations(
      sellers as UserProfile[],
      location,
      distance,
      sortBy
    );

    result.sellers = processedSellers;
    result.totalResults = processedSellers.length;
  } else {
    result.sellers = (sellers as UserProfile[]) || [];
    result.totalResults = count || 0;
  }

  return result;
}

function buildBaseSellersQuery(supabase: SupabaseClient) {
  return supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'seller')
    .eq('seller_status', 'approved');
}

function applySellerTextSearch(query: QueryBuilder, searchText: string) {
  if (!searchText) return query;

  return query.or(
    `seller_details->>business_name.ilike.%${searchText}%,seller_details->>description.ilike.%${searchText}%`
  );
}

function applySellerCategoryFilter(query: QueryBuilder, category_id: string) {
  if (!category_id) return query;

  return query.filter(
    'seller_details',
    'cs', //contains
    JSON.stringify({ business_category: category_id })
  );
}

function applySellerServiceModeFilter(
  query: QueryBuilder,
  serviceMode: string
) {
  if (!serviceMode) return query;

  return query.filter(
    'seller_details->service_modes',
    'cs',
    JSON.stringify([{ type: serviceMode, enabled: true }])
  );
}

function applySortingToSellersQuery(query: QueryBuilder, sortBy: SortByType) {
  switch (sortBy) {
    case 'newest':
      return query.order('created_at', { ascending: false });
    default:
      return query.order('created_at', { ascending: false });
  }
}

function processSellerLocations(
  sellers: UserProfile[],
  userLocation: Location,
  maxDistance: number,
  sortBy: SortByType
) {
  // Add distance to each seller
  let sellersWithDistance = sellers.map((seller) => {
    const sellerLocation = seller.seller_details?.location;
    let distanceFromUser = null;

    if (sellerLocation && sellerLocation.lat && sellerLocation.lng) {
      distanceFromUser = calculateDistance(
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: sellerLocation.lat, longitude: sellerLocation.lng },
        'km'
      );
    }

    return {
      ...seller,
      distanceFromUser,
    };
  });

  // Filter out sellers without location data when user location is provided
  sellersWithDistance = sellersWithDistance.filter(
    (seller) => seller.distanceFromUser !== null
  );

  if (
    (!maxDistance || maxDistance === 0) &&
    userLocation.lat &&
    userLocation.lng
  ) {
    maxDistance = 5;
  }

  if (maxDistance > 0) {
    // Apply distance filter if specified
    sellersWithDistance = sellersWithDistance.filter(
      (seller) => seller.distanceFromUser! <= maxDistance
    );
  }

  // Apply proximity sorting if specified
  if (sortBy === 'proximity') {
    sellersWithDistance = sortByProximity(sellersWithDistance);
  }

  return sellersWithDistance;
}

// ===== LISTING SEARCH FUNCTIONS =====

async function searchListings(
  supabase: SupabaseClient,
  params: SearchParams,
  result: SearchResult
): Promise<SearchResult> {
  const {
    query = '',
    category = '',
    productType = '',
    serviceMode = '',
    priceRange = [0, Infinity],
    distance = 0,
    location,
    sortBy = 'relevance',
    page = 1,
    limit = 10,
  } = params;

  const offset = calculateOffset(page, limit);

  // Build base listings query
  let listingsQuery = buildBaseListingsQuery(supabase);

  // Apply text search filters
  listingsQuery = applyListingTextSearch(listingsQuery, query);

  // Apply category filter
  listingsQuery = applyListingCategoryFilter(listingsQuery, category);

  // Apply product type filter
  listingsQuery = applyListingProductTypeFilter(listingsQuery, productType);

  // Apply service mode filter
  listingsQuery = applyListingServiceModeFilter(listingsQuery, serviceMode);

  // Apply price range filter
  listingsQuery = applyListingPriceRangeFilter(listingsQuery, priceRange);

  // Apply sorting
  listingsQuery = applySortingToListingsQuery(listingsQuery, sortBy);

  // Execute query with pagination
  const { data: listings, count } = await listingsQuery.range(
    offset,
    offset + limit - 1
  );

  // Process location-based filtering
  if (location?.lat && location?.lng) {
    const processedListings = processListingLocations(
      listings as Listing[],
      location,
      distance,
      sortBy
    );

    result.listings = processedListings;
    result.totalResults = processedListings.length;
  } else {
    result.listings = (listings as Listing[]) || [];
    result.totalResults = count || 0;
  }

  return result;
}

function buildBaseListingsQuery(supabase: SupabaseClient) {
  return supabase
    .from('listings')
    .select('*, seller:seller_id(*)', { count: 'exact' })
    .eq('is_active', true);
}

function applyListingTextSearch(query: QueryBuilder, searchText: string) {
  if (!searchText) return query;

  return query.or(
    `title.ilike.%${searchText}%,description.ilike.%${searchText}%`
  );
}

function applyListingCategoryFilter(query: QueryBuilder, category: string) {
  if (!category) return query;

  return query.eq('category', category);
}

function applyListingProductTypeFilter(
  query: QueryBuilder,
  productType: string
) {
  if (!productType) return query;

  return query.eq('product_type', productType);
}

function applyListingServiceModeFilter(
  query: QueryBuilder,
  serviceMode: string
) {
  if (!serviceMode) return query;

  return query.contains('service_modes', [serviceMode]);
}

function applyListingPriceRangeFilter(
  query: QueryBuilder,
  priceRange: [number, number]
) {
  if (priceRange[0] === 0 && priceRange[1] === Infinity) return query;

  let filteredQuery = query;

  if (priceRange[0] > 0) {
    filteredQuery = filteredQuery.gte('price', priceRange[0]);
  }

  if (priceRange[1] < Infinity) {
    filteredQuery = filteredQuery.lte('price', priceRange[1]);
  }

  return filteredQuery;
}

function applySortingToListingsQuery(query: QueryBuilder, sortBy: SortByType) {
  switch (sortBy) {
    case 'newest':
      return query.order('created_at', { ascending: false });
    case 'price_asc':
      return query.order('price', { ascending: true });
    case 'price_desc':
      return query.order('price', { ascending: false });
    default:
      return query.order('created_at', { ascending: false });
  }
}

function processListingLocations(
  listings: Listing[],
  userLocation: Location,
  maxDistance: number,
  sortBy: SortByType
) {
  // Add distance to each listing
  let listingsWithDistance = listings.map((listing) => {
    let distanceFromUser = null;

    if (listing.location && listing.location.lat && listing.location.lng) {
      distanceFromUser = calculateDistance(
        { latitude: userLocation.lat, longitude: userLocation.lng },
        {
          latitude: listing.location.lat,
          longitude: listing.location.lng,
        },
        'km'
      );
    }

    return {
      ...listing,
      distanceFromUser,
    };
  });

  // Filter out listings without location data when user location is provided
  listingsWithDistance = listingsWithDistance.filter(
    (listing) => listing.distanceFromUser !== null
  );

  if (
    (!maxDistance || maxDistance === 0) &&
    userLocation.lat &&
    userLocation.lng
  ) {
    maxDistance = 5;
  }

  // Apply distance filter if specified
  if (maxDistance > 0) {
    listingsWithDistance = listingsWithDistance.filter(
      (listing) => listing.distanceFromUser! <= maxDistance
    );
  }

  // Apply proximity sorting if specified
  if (sortBy === 'proximity') {
    listingsWithDistance = sortByProximity(listingsWithDistance);
  }

  return listingsWithDistance;
}

// ===== CATEGORY SEARCH FUNCTIONS =====

async function searchCategories(
  supabase: SupabaseClient,
  params: SearchParams,
  result: SearchResult
): Promise<SearchResult> {
  const { query = '', page = 1, limit = 10 } = params;

  const offset = calculateOffset(page, limit);

  // Build and execute categories query
  let categoriesQuery = buildBaseCategoriesQuery(supabase);

  // Apply text search
  categoriesQuery = applyCategoryTextSearch(categoriesQuery, query);

  // Apply sorting
  categoriesQuery = categoriesQuery.order('name');

  // Execute query with pagination
  const { data: categories, count } = await categoriesQuery.range(
    offset,
    offset + limit - 1
  );

  result.categories = (categories as Category[]) || [];
  result.totalResults = count || 0;

  return result;
}

function buildBaseCategoriesQuery(supabase: SupabaseClient) {
  return supabase.from('categories').select('*', { count: 'exact' });
}

function applyCategoryTextSearch(query: QueryBuilder, searchText: string) {
  if (!searchText) return query;

  return query.or(
    `name.ilike.%${searchText}%,description.ilike.%${searchText}%`
  );
}

// ===== PRODUCT TYPE SEARCH FUNCTIONS =====

async function searchProductTypes(
  supabase: SupabaseClient,
  params: SearchParams,
  result: SearchResult
): Promise<SearchResult> {
  const { query = '', page = 1, limit = 10 } = params;

  const offset = calculateOffset(page, limit);

  // Build and execute product types query
  let productTypesQuery = buildBaseProductTypesQuery(supabase);

  // Apply text search
  productTypesQuery = applyProductTypeTextSearch(productTypesQuery, query);

  // Apply sorting
  productTypesQuery = productTypesQuery.order('name');

  // Execute query with pagination
  const { data: productTypes, count } = await productTypesQuery.range(
    offset,
    offset + limit - 1
  );

  result.productTypes = (productTypes as { id: string; name: string }[]) || [];
  result.totalResults = count || 0;

  return result;
}

function buildBaseProductTypesQuery(supabase: SupabaseClient) {
  return supabase.from('product_types').select('*', { count: 'exact' });
}

function applyProductTypeTextSearch(query: QueryBuilder, searchText: string) {
  if (!searchText) return query;

  return query.ilike('name', `%${searchText}%`);
}

// ===== UTILITY FUNCTIONS =====

function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

function sortByProximity<T extends { distanceFromUser: number | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    // Null distances go to the end
    if (a.distanceFromUser === null) return 1;
    if (b.distanceFromUser === null) return -1;
    return (a.distanceFromUser || 0) - (b.distanceFromUser || 0);
  });
}
