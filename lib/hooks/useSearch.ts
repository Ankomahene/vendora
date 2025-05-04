import { SearchResult, searchItems } from '@/services/search/searchService';
import { useQuery } from '@tanstack/react-query';
import { useSearchParamsValues } from './useSearchParamsValues';

/**
 * Hook for handling item search functionality
 * Separated from URL management for better separation of concerns
 */
export function useSearch() {
  const searchParams = useSearchParamsValues();

  // Query for search results
  const { data, isLoading, isError, error, refetch } = useQuery<SearchResult>({
    queryKey: ['search', searchParams],
    queryFn: () => searchItems(searchParams),
    enabled: true,
    staleTime: 60000, // 1 minute
  });

  // Default empty results object
  const emptyResults: SearchResult = {
    sellers: [],
    listings: [],
    categories: [],
    productTypes: [],
    totalResults: 0,
  };

  return {
    params: searchParams,
    results: data || emptyResults,
    isLoading,
    isError,
    error,
    refetch,
  };
}
