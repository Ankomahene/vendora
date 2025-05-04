import { useSearchParams } from 'next/navigation';
import { SearchParams } from '@/services/search/searchService';
import { parseSearchParamsFromUrl } from '@/lib/utils/searchParamsUtils';
import { useMemo } from 'react';

/**
 * Hook to get current search parameters from URL
 * Use this when you only need to read the current search params without modifying them
 */
export function useSearchParamsValues(): SearchParams {
  const searchParams = useSearchParams();

  return useMemo(() => {
    return parseSearchParamsFromUrl(searchParams);
  }, [searchParams]);
}
