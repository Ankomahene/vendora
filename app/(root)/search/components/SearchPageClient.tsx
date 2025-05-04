'use client';

import { Location } from '@/components/map/types';
import { useSearch } from '@/lib/hooks';
import { useUrlSearchParams } from '@/lib/hooks/useUrlSearchParams';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { SearchField } from './SearchField';
import { SearchFiltersPanel } from './SearchFiltersPanel';
import { SearchNotice } from './SearchNotice';
import { SearchResults } from './SearchResults';

export function SearchPageClient({ location }: { location: Location | null }) {
  const { results, params, isLoading } = useSearch();

  console.log(results);

  const { updateUrlSearchParams } = useUrlSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel - Desktop */}
          <div className="hidden lg:block w-[350px] flex-shrink-0">
            <SearchFiltersPanel />
          </div>

          <div className="flex-1">
            <SearchField />
            <div className="py-4">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Search Results
              </h1>

              {!isLoading && (
                <SearchNotice
                  totalResults={results.totalResults}
                  location={location}
                />
              )}
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
                  onPageChange={(page: number) =>
                    updateUrlSearchParams({ page })
                  }
                  currentPage={params.page || 1}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>{mobileFiltersOpen ? 'Close' : 'Filters & Map'}</span>
        </button>
      </div>

      {/* Mobile Filters Panel with Map */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 bg-zinc-900/50 z-50">
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-md bg-white dark:bg-zinc-800 overflow-auto py-4">
            <div className="p-4 border-b dark:border-zinc-700">
              <p className="text-xl p-2">Filters</p>
              <SearchFiltersPanel />
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 absolute top-2 right-4"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
