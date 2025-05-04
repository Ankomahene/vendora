/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParamsValues } from '@/lib/hooks/useSearchParamsValues';
import { SearchParams } from '@/services';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getLocationFromCoordinates } from './utils';

// Define the shape of our search context state
interface SearchContextType {
  searchState: SearchParams;
  showMap: boolean;
  setQuery: (query: keyof SearchParams, value: any) => void;
  setShowMap: (value: boolean) => void;
  resetSearchState: () => void;
}

const initialContextState: SearchParams = {
  searchType: 'sellers',
  category: 'all',
  productType: 'all',
  location: null,
  distance: 0,
  sortBy: 'relevance',
  serviceMode: 'all',
  query: '',
  priceRange: [0, 1000],
  limit: 10,
  page: 1,
};

// Create the context with a default value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
interface SearchProviderProps {
  children: ReactNode;
}

export function SearchContextProvider({ children }: SearchProviderProps) {
  const searchParamsValues = useSearchParamsValues();
  const [searchState, setSearchState] =
    useState<SearchParams>(initialContextState);
  const [showMap, setShowMap] = useState(false);

  const setQuery = (query: keyof SearchParams, value: any) => {
    setSearchState((prevState) => ({
      ...prevState,
      [query]: value,
    }));
  };

  const resetSearchState = () => {
    setSearchState(initialContextState);
  };

  useEffect(() => {
    setSearchState((prevState) => ({ ...prevState, ...searchParamsValues }));
  }, [searchParamsValues]);

  useEffect(() => {
    async function updateLocation() {
      if (searchState.location != null && !searchState.location.name) {
        const location = await getLocationFromCoordinates(
          searchState.location.lng,
          searchState.location.lat
        );
        setQuery('location', { ...searchState, ...location });
      }
    }

    updateLocation();
  }, [searchState]);

  // Value object that will be provided to consumers
  const value = {
    searchState,
    setQuery,
    showMap,
    setShowMap,
    resetSearchState,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

// Custom hook for consuming the context
export function useSearchContext(): SearchContextType {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }

  return context;
}
