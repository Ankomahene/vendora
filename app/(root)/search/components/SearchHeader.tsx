'use client';

import { useState, FormEvent } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchParams } from '@/services/search/searchService';

interface SearchHeaderProps {
  searchType: SearchParams['searchType'];
  searchQuery: string;
  onSearch: (
    searchType: SearchParams['searchType'],
    query: string,
    location?: string
  ) => void;
}

export function SearchHeader({
  searchType = 'sellers',
  searchQuery = '',
  onSearch,
}: SearchHeaderProps) {
  const [localSearchType, setLocalSearchType] =
    useState<SearchParams['searchType']>(searchType);
  const [query, setQuery] = useState(searchQuery);
  const [location, setLocation] = useState('San Francisco, CA');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(localSearchType, query, location);
  };

  return (
    <div className="sticky top-20 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="container py-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 flex gap-4">
            <Select
              value={localSearchType}
              onValueChange={(value) =>
                setLocalSearchType(value as SearchParams['searchType'])
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sellers">Businesses</SelectItem>
                <SelectItem value="listings">Listings</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
                <SelectItem value="product_types">Product Types</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <Input
                type="text"
                placeholder={`Search ${localSearchType}...`}
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 md:flex-none">
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 w-full md:w-[200px]"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
