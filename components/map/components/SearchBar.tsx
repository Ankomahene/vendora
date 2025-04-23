'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SearchBarProps, SearchResult } from '../types';
import { searchLocations } from '../utils';

export function SearchBar({ onSearchResult, className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);

    try {
      const searchResults = await searchLocations(searchTerm);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onSearchResult?.(result);
    setResults([]);
    setSearchTerm(result.name);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
          className="shrink-0"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results.length > 0 && (
        <Card className="absolute left-0 right-0 z-40 mt-1 max-h-60 overflow-auto p-2">
          <ul className="space-y-1">
            {results.map((result) => (
              <li
                key={result.id}
                className="cursor-pointer rounded-md p-2 text-sm hover:bg-secondary"
                onClick={() => handleResultClick(result)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
