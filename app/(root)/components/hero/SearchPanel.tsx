'use client';
import { GoogleSearchBar } from '@/components/map';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories, useCurrentLocation } from '@/lib/hooks';
import { useUrlSearchParams } from '@/lib/hooks/useUrlSearchParams';
import { Location } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SearchParams, SearchType, SortByType } from '@/services';
import { ChevronDown, LocateIcon, Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DistanceSlider } from './DistanceSlider';
import { ProductTypeSelect } from './ProductTypeSelect';
import { SelectType } from './SelectType';
import { SortBySelect } from './SortBySelect';

export function SearchPanel() {
  const [searchType, setSearchType] = useState<SearchType>('sellers');
  const [sortBy, setSortBy] = useState<SortByType>('relevance');
  const [distance, setDistance] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [productType, setProductType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const {
    location: currentLocation,
    detectCurrentLocation,
    isLoading: isDetectingLocation,
    error,
  } = useCurrentLocation();
  const { data: categories, isLoading } = useCategories();
  const { updateUrlSearchParams } = useUrlSearchParams();

  const handleSearch = () => {
    const searchParams: SearchParams = {
      searchType,
      category: selectedCategory,
      location,
      distance: location ? distance : 0,
      sortBy,
    };

    updateUrlSearchParams(searchParams);
  };

  useEffect(() => {
    if (currentLocation) {
      setLocation(currentLocation);
    }
  }, [currentLocation]);

  return (
    <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4 md:p-6 mt-6">
      <div className="flex flex-col md:flex-row gap-4">
        <SelectType
          searchType={searchType}
          setSearchType={(searchTypeValue) =>
            setSearchType(searchTypeValue as SearchType)
          }
        />

        <div className="relative flex-1 flex items-center gap-[2px]">
          <GoogleSearchBar
            location={location as Location | undefined}
            onSearchResult={(result) => {
              setLocation(result as unknown as Location);
            }}
          />
          <Button
            variant="outline"
            className="w-8 h-10 rounded-sm p-1"
            onClick={() => {
              detectCurrentLocation();
              if (!isDetectingLocation && !error) {
                setSortBy('proximity');
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

        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-shrink-0 space-x-1">
                <Sliders size={16} />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <DistanceSlider
                  distance={distance}
                  setDistance={setDistance}
                  disabled={!location}
                />

                <ProductTypeSelect
                  productType={productType}
                  setProductType={setProductType}
                  searchType={searchType}
                />

                <SortBySelect
                  sortBy={sortBy}
                  setSortBy={(sortByValue) =>
                    setSortBy(sortByValue as SortByType)
                  }
                  searchType={searchType}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            className="bg-primary hover:bg-primary/60"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 px-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-sm font-medium flex items-center mx-auto md:mx-0 gap-1"
          disabled={isLoading}
        >
          {expanded ? 'Show less' : 'More categories'}
          <ChevronDown size={16} />
        </button>

        {selectedCategory && expanded && (
          <button
            className="text-sm font-medium cursor-pointer mr-2"
            onClick={() => setSelectedCategory(undefined)}
          >
            Clear selection
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 max-h-[250px] overflow-y-auto">
          {categories?.map((category) => (
            <CategoryButton
              key={category.id}
              name={category.name}
              image={category.image || ''}
              selected={category.id === selectedCategory}
              setCategory={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryButtonProps {
  name: string;
  image: string;
  setCategory: () => void;
  selected: boolean;
}

function CategoryButton({
  name,
  image,
  selected,
  setCategory,
}: CategoryButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center justify-center flex-col bg-zinc-50 dark:bg-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-600 rounded-lg p-3 transition-colors',
        selected && 'bg-orange-50 dark:bg-zinc-600 border border-orange-500'
      )}
      onClick={setCategory}
    >
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
    </button>
  );
}
