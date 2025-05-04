import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/lib/hooks';
import React from 'react';
import { useSearchContext } from '../SearchContext';

export const CategorySelect = () => {
  const {
    searchState: { category, searchType },
    setQuery,
  } = useSearchContext();
  const { data: categories, isLoading } = useCategories();

  if (searchType !== 'sellers' && searchType !== 'listings') return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Category
      </h3>
      <Select
        value={category}
        onValueChange={(value) => setQuery('category', value)}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
