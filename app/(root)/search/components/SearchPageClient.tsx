'use client';

import { useState } from 'react';
import { Category } from '@/lib/types/category';
import { SearchHeader } from './SearchHeader';
import { SearchResults } from './SearchResults';
import { SearchFiltersPanel } from './SearchFiltersPanel';
import { MapView } from './MapView';
import { useSearch } from '@/lib/hooks/useSearch';
import { SearchParams } from '@/services/search/searchService';
import { Loader2 } from 'lucide-react';

interface SearchPageClientProps {
  categories: Category[];
  productTypes: { id: string; name: string }[];
  initialSearchParams?: {
    q?: string;
    type?: string;
    category?: string;
    mode?: string;
    minPrice?: string;
    maxPrice?: string;
    distance?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

export function SearchPageClient({
  categories,
  productTypes,
  initialSearchParams = {},
}: SearchPageClientProps) {
  const [showMap, setShowMap] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Convert URL params to search params
  const initialParams: Partial<SearchParams> = {
    searchType:
      (initialSearchParams.type as SearchParams['searchType']) || 'sellers',
    query: initialSearchParams.q || '',
    category: initialSearchParams.category || '',
    serviceMode: initialSearchParams.mode || '',
    priceRange: [
      parseInt(initialSearchParams.minPrice || '0'),
      parseInt(initialSearchParams.maxPrice || '1000'),
    ],
    distance: parseInt(initialSearchParams.distance || '50'),
    sortBy: (initialSearchParams.sort as SearchParams['sortBy']) || 'relevance',
    page: parseInt(initialSearchParams.page || '1'),
    limit: parseInt(initialSearchParams.limit || '10'),
  };

  // Use custom search hook
  const { params, updateSearchParams, results, isLoading } =
    useSearch(initialParams);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <SearchHeader
        searchType={params.searchType}
        searchQuery={params.query || ''}
        onSearch={(
          searchType: SearchParams['searchType'],
          query: string
          //   _location?: string
        ) => {
          updateSearchParams({
            searchType,
            query,
            page: 1,
            // When location is implemented, we will need to convert the location string
            // to coordinates and set the location parameter accordingly
          });
        }}
      />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SearchFiltersPanel
              categories={categories}
              productTypes={productTypes}
              params={params}
              onParamsChange={updateSearchParams}
              className="sticky top-24"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Search Results
                </h1>
                {!isLoading && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Found {results.totalResults} result
                    {results.totalResults !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading results...</span>
              </div>
            ) : (
              <div className="space-y-8">
                <SearchResults
                  searchType={params.searchType}
                  results={results}
                  onPageChange={(page: number) => updateSearchParams({ page })}
                  currentPage={params.page || 1}
                />
              </div>
            )}
          </div>

          {/* Map View - Desktop */}
          {showMap && (
            <div className="hidden lg:block w-96 flex-shrink-0">
              <div className="sticky top-24">
                <MapView />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Map Toggle */}
      {showMap && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-64 bg-white dark:bg-zinc-800 shadow-lg rounded-t-xl overflow-hidden">
          <MapView />
          <button
            onClick={() => setShowMap(false)}
            className="absolute top-4 right-4 bg-white dark:bg-zinc-700 rounded-full p-2 shadow-lg"
          >
            <span className="sr-only">Close map</span>×
          </button>
        </div>
      )}

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filters Panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 bg-zinc-900/50 z-50">
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white dark:bg-zinc-800 overflow-auto">
            <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center">
              <h2 className="text-lg font-medium">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <SearchFiltersPanel
                categories={categories}
                productTypes={productTypes}
                params={params}
                onParamsChange={(newParams: Partial<SearchParams>) => {
                  updateSearchParams(newParams);
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
