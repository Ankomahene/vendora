import { useQuery } from '@tanstack/react-query';
import {
  SearchParams,
  SearchResult,
  searchItems,
} from '@/services/search/searchService';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useSearch(initialParams?: Partial<SearchParams>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params from URL
  const [params, setParams] = useState<SearchParams>({
    searchType:
      (searchParams.get('type') as SearchParams['searchType']) || 'sellers',
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    serviceMode: searchParams.get('mode') || '',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '1000'),
    ],
    distance: parseInt(searchParams.get('distance') || '50'),
    sortBy: (searchParams.get('sort') as SearchParams['sortBy']) || 'relevance',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    ...(initialParams || {}),
  });

  // Query for search results
  const { data, isLoading, isError, error, refetch } = useQuery<SearchResult>({
    queryKey: ['search', params],
    queryFn: () => searchItems(params),
    enabled: true,
    staleTime: 60000, // 1 minute
  });

  // Update URL with search params
  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (params.searchType) urlParams.set('type', params.searchType);
    if (params.query) urlParams.set('q', params.query);
    if (params.category) urlParams.set('category', params.category);
    if (params.serviceMode) urlParams.set('mode', params.serviceMode);
    if (params.priceRange?.[0] > 0)
      urlParams.set('minPrice', params.priceRange[0].toString());
    if (params.priceRange?.[1] < 1000)
      urlParams.set('maxPrice', params.priceRange[1].toString());
    if (params.distance !== 50)
      urlParams.set('distance', params.distance.toString());
    if (params.sortBy !== 'relevance') urlParams.set('sort', params.sortBy);
    if (params.page > 1) urlParams.set('page', params.page.toString());
    if (params.limit !== 10) urlParams.set('limit', params.limit.toString());

    const url = `/search?${urlParams.toString()}`;
    router.push(url, { scroll: false });
  }, [params, router]);

  // Function to update search parameters
  const updateSearchParams = (newParams: Partial<SearchParams>) => {
    setParams((prev: SearchParams) => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when filters change
      page: newParams.page || 1,
    }));
  };

  return {
    params,
    updateSearchParams,
    results: data || {
      sellers: [],
      listings: [],
      categories: [],
      productTypes: [],
      totalResults: 0,
    },
    isLoading,
    isError,
    error,
    refetch,
  };
}
