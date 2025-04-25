'use client';

import { CategoryFilters } from './CategoriesClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CategoriesHeaderProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
}

export function CategoriesHeader({
  filters,
  onFiltersChange,
}: CategoriesHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = filters.search?.trim();

    // Build the query string
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    // Update the URL
    router.push(`/categories?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-4">Categories</h1>
        <p className="text-lg opacity-90 mb-8">
          Browse our categorized products and services to find exactly what you
          need
        </p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-12 h-14 rounded-full bg-white text-black"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </form>
      </div>
    </div>
  );
}
