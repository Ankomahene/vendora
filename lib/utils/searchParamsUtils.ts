import { SearchParams } from '@/services/search/searchService';
import { Location } from '@/components/map/types';
import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Parse location from URL search parameters
 */
export const parseLocationFromParams = (
  searchParams: ReadonlyURLSearchParams
): Location | undefined => {
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (lat && lng) {
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  }
  return undefined;
};

/**
 * Parse search parameters from URL into a SearchParams object
 */
export const parseSearchParamsFromUrl = (
  searchParams: ReadonlyURLSearchParams
): SearchParams => {
  return {
    searchType:
      (searchParams.get('type') as SearchParams['searchType']) || 'sellers',
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    productType: searchParams.get('product_type') || 'all',
    serviceMode: searchParams.get('mode') || 'all',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '1000'),
    ],
    location: parseLocationFromParams(searchParams),
    distance: parseInt(searchParams.get('distance') || '0'),
    sortBy: (searchParams.get('sort') as SearchParams['sortBy']) || 'relevance',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  };
};

/**
 * Convert SearchParams to search parameters string only (without path)
 * Merges with existing search params from the URL
 */
export const searchParamsToQueryString = (
  params: Partial<SearchParams>,
  currentSearchParams?: ReadonlyURLSearchParams
): string => {
  // Start with current params if available, otherwise create new URLSearchParams
  const urlParams = new URLSearchParams();

  // If we have current params, copy all existing values first
  if (currentSearchParams) {
    currentSearchParams.forEach((value, key) => {
      urlParams.set(key, value);
    });
  }

  // Now update with any new params
  if (params.searchType) urlParams.set('type', params.searchType);
  if (params.query !== undefined) {
    if (params.query) {
      urlParams.set('q', params.query);
    } else {
      urlParams.delete('q');
    }
  }

  if (params.category !== undefined) {
    if (params.category && params.category !== 'all') {
      urlParams.set('category', params.category);
    } else {
      urlParams.delete('category');
    }
  }

  if (params.productType !== undefined) {
    if (params.productType && params.productType !== 'all') {
      urlParams.set('product_type', params.productType);
    } else {
      urlParams.delete('product_type');
    }
  }

  if (params.serviceMode !== undefined) {
    if (params.serviceMode && params.serviceMode !== 'all') {
      urlParams.set('mode', params.serviceMode);
    } else {
      urlParams.delete('mode');
    }
  }

  // Handle price range
  const priceRange = params.priceRange;
  if (priceRange && Array.isArray(priceRange)) {
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];

    if (minPrice > 0) {
      urlParams.set('minPrice', minPrice.toString());
    } else {
      urlParams.delete('minPrice');
    }

    if (maxPrice < 1000) {
      urlParams.set('maxPrice', maxPrice.toString());
    } else {
      urlParams.delete('maxPrice');
    }
  }

  // Handle location parameters
  if (params.location !== undefined) {
    if (params.location) {
      urlParams.set('lat', params.location.lat.toString());
      urlParams.set('lng', params.location.lng.toString());
    } else {
      // If location is null, remove location params
      urlParams.delete('lat');
      urlParams.delete('lng');
      // Also remove distance since it depends on location
      urlParams.delete('distance');
    }
  }

  // Only include distance if explicitly provided and valid
  if (params.distance !== undefined) {
    if (params.distance && params.distance > 0 && params.distance < 100) {
      urlParams.set('distance', params.distance.toString());
    } else {
      urlParams.delete('distance');
    }
  }

  if (params.sortBy !== undefined) {
    if (params.sortBy && params.sortBy !== 'relevance') {
      urlParams.set('sort', params.sortBy);
    } else {
      urlParams.delete('sort');
    }
  }

  if (params.page !== undefined) {
    if (params.page && params.page > 1) {
      urlParams.set('page', params.page.toString());
    } else {
      urlParams.delete('page');
    }
  }

  if (params.limit !== undefined) {
    if (params.limit && params.limit !== 10) {
      urlParams.set('limit', params.limit.toString());
    } else {
      urlParams.delete('limit');
    }
  }

  return urlParams.toString();
};

/**
 * Convert SearchParams to URL search parameters string
 * Preserves existing parameters not specified in the params object
 */
export const createUrlFromSearchParams = (
  params: Partial<SearchParams>,
  currentSearchParams?: ReadonlyURLSearchParams
): string => {
  return `/search?${searchParamsToQueryString(params, currentSearchParams)}`;
};
