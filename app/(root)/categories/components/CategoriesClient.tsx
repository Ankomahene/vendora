'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryGrid } from './CategoryGrid';
import { CategoriesFilters } from './CategoriesFilters';
import { CategoriesHeader } from './CategoriesHeader';
import { Category } from '@/lib/types/category';

export type CategoryFilters = {
  search?: string;
  sortBy?: 'name' | 'newest' | 'popular';
};

export interface EnhancedCategory extends Category {
  businessCount: number;
  listingCount: number;
}

interface CategoriesClientProps {
  categories: EnhancedCategory[];
}

export function CategoriesClient({
  categories: rawCategories = [],
}: CategoriesClientProps) {
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<CategoryFilters>({
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as CategoryFilters['sortBy']) || 'name',
  });

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      sortBy:
        (searchParams.get('sortBy') as CategoryFilters['sortBy']) || 'name',
    });
  }, [searchParams]);

  // Transform raw categories to include public-facing properties and apply filters
  const categories = useMemo<EnhancedCategory[]>(() => {
    if (!rawCategories.length) return [];

    // Apply search filter
    let filtered = [...rawCategories];
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'newest') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (filters.sortBy === 'popular') {
        return (
          b.listingCount + b.businessCount - (a.listingCount + a.businessCount)
        );
      }
      return a.name.localeCompare(b.name); // Default sorting
    });
  }, [rawCategories, filters]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <CategoriesHeader filters={filters} onFiltersChange={setFilters} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategoriesFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-24"
            />
          </div>

          <div className="flex-1">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl mb-6 lg:hidden">
              <CategoriesFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            <CategoryGrid categories={categories} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
