'use client';
import { useState } from 'react';
import { SearchFilters } from '@/lib/types';
import { SearchHeader } from './SearchHeader';
import { SearchResults } from './SearchResults';
import { SearchFiltersPanel } from './SearchFiltersPanel';
import { MapView } from './MapView';

export function SearchPageClient() {
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 1000],
    category: '',
    serviceMode: '',
    distance: 5,
    location: 'San Francisco, CA',
    sortBy: 'relevance',
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <SearchHeader />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SearchFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-24"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Search Results
              </h1>
              <button
                onClick={() => setShowMap(!showMap)}
                className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="xl:col-span-2">
                <SearchResults filters={filters} />
              </div>
            </div>
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
          onClick={() => {
            /* Toggle mobile filters */
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
