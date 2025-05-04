'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUrlSearchParams } from '@/lib/hooks/useUrlSearchParams';
import { useSearchContext } from '../SearchContext';
import { CategorySelect } from './CategorySelect';
import { DistanceSlider } from './DistanceSlider';
import { PriceRangeSlider } from './PriceRangeSlider';
import { ProductTypeSelect } from './ProductTypeSelect';
import { ServiceModeSelect } from './ServiceModeSelect';
import { SortBySelect } from './SortBySelect';
import { SelectType } from './SelectType';
import { GoogleSearchBar } from '@/components/map';
import { LocateIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentLocation } from '@/lib/hooks';
import { useEffect } from 'react';
import { Location, SearchResult } from '@/components/map/types';
import { SearchMapModal } from './SearchMapModal';

export function SearchFiltersPanel() {
  const { searchState, setQuery } = useSearchContext();
  const {
    location: currentLocation,
    detectCurrentLocation,
    isLoading: isDetectingLocation,
    error,
  } = useCurrentLocation();
  const { updateUrlSearchParams } = useUrlSearchParams();

  const handleApplyFilters = () => {
    updateUrlSearchParams({
      ...searchState,
      page: 1,
    });
  };

  const handleLocationSearch = (result: SearchResult) => {
    const location: Location = {
      lat: result.latitude,
      lng: result.longitude,
      name: result.name,
      address: result.address,
    };
    setQuery('location', location);
    setQuery('sortBy', 'proximity');
  };

  useEffect(() => {
    setQuery('location', currentLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  return (
    <Card className="p-0 rounded-sm">
      <Card className="p-4 rounded-sm rounded-b-none flex flex-col gap-3">
        <div>
          <span className="py-1 text-sm font-medium">
            What are you searching for?
          </span>
          <SelectType />
        </div>
        {/* location search */}
        {searchState.searchType !== 'product_types' &&
          searchState.searchType !== 'categories' && (
            <>
              <div>
                <div className="flex justify-between items-center">
                  <span className="py-1 text-sm font-medium">
                    Search location
                  </span>

                  <SearchMapModal />
                </div>

                <div className="relative flex-1 flex gap-1 items-center">
                  <GoogleSearchBar
                    onSearchResult={handleLocationSearch}
                    className="w-full"
                    location={searchState.location || undefined}
                    disabled={isDetectingLocation}
                  />
                  <Button
                    variant="outline"
                    className="w-8 h-10 rounded-sm p-1"
                    onClick={() => {
                      setQuery('location', null);
                      setQuery('sortBy', 'relevance');
                    }}
                    disabled={isDetectingLocation}
                    title="Clear location"
                  >
                    <X />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-8 h-10 rounded-sm p-1"
                    onClick={() => {
                      detectCurrentLocation();
                      if (!isDetectingLocation && !error) {
                        setQuery('sortBy', 'proximity');
                      }
                    }}
                    disabled={isDetectingLocation}
                    title="Select current location"
                  >
                    <LocateIcon
                      className={cn(isDetectingLocation ? 'animate-spin' : '')}
                    />
                  </Button>
                </div>
              </div>
              <DistanceSlider />
            </>
          )}
      </Card>
      <div className="p-4 space-y-4">
        <PriceRangeSlider />
        <CategorySelect />
        <ProductTypeSelect />
        <ServiceModeSelect />
        <SortBySelect />

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-950 hover:text-foreground"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}
