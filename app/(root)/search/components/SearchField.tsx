import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';
import { useSearchContext } from '../SearchContext';
import { SearchTypeMap } from './consts';
import { Button } from '@/components/ui/button';
import { useUrlSearchParams } from '@/lib/hooks/useUrlSearchParams';

export const SearchField = () => {
  const {
    searchState: { searchType, query: searchTerm },
    setQuery,
  } = useSearchContext();
  const { updateUrlSearchParams } = useUrlSearchParams();

  const handleSearch = () => {
    updateUrlSearchParams({ query: searchTerm });
  };

  return (
    <div className="flex-1 relative">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
        size={18}
      />
      <div className="flex gap-1">
        <Input
          type="text"
          placeholder={`Search ${SearchTypeMap[searchType]}...`}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setQuery('query', e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
};
