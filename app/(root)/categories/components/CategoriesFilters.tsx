'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { CategoryFilters } from './CategoriesClient';

interface CategoriesFiltersProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  className?: string;
}

export function CategoriesFilters({
  filters,
  onFiltersChange,
  className = '',
}: CategoriesFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as CategoryFilters['sortBy'],
    });
  };

  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-6 ${className}`}
    >
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Search Categories
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Sort By
        </h3>
        <Select
          value={filters.sortBy || 'name'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
