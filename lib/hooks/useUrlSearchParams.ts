import { useRouter, useSearchParams } from 'next/navigation';
import { SearchParams } from '@/services/search/searchService';
import { useCallback } from 'react';
import {
  parseSearchParamsFromUrl,
  createUrlFromSearchParams,
} from '@/lib/utils/searchParamsUtils';

/**
 * Hook to manage URL search parameters for search functionality
 */
export function useUrlSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Parse search parameters from URL into SearchParams object
   */
  const getSearchParamsFromUrl = useCallback((): SearchParams => {
    return parseSearchParamsFromUrl(searchParams);
  }, [searchParams]);

  /**
   * Update URL with search parameters
   * Preserves existing parameters not specified in the params object
   */
  const updateUrlSearchParams = useCallback(
    (params: Partial<SearchParams>) => {
      const url = createUrlFromSearchParams(params, searchParams);
      router.push(url);
    },
    [router, searchParams]
  );

  return {
    getSearchParamsFromUrl,
    updateUrlSearchParams,
  };
}
