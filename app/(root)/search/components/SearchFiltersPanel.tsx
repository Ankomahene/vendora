'use client';

import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/lib/types/category';
import { SearchParams } from '@/services/search/searchService';
import { CURRENCY } from '@/lib/constants';

interface SearchFiltersPanelProps {
  categories: Category[];
  productTypes: { id: string; name: string }[];
  params: SearchParams;
  onParamsChange: (params: Partial<SearchParams>) => void;
  className?: string;
}

export function SearchFiltersPanel({
  categories,
  productTypes,
  params,
  onParamsChange,
  className,
}: SearchFiltersPanelProps) {
  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-6 ${
        className || ''
      }`}
    >
      {/* Price Range - only show for listings */}
      {params.searchType === 'listings' && (
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
            Price Range
          </h3>
          <Slider
            value={params.priceRange || [0, 1000]}
            onValueChange={(value) =>
              onParamsChange({ priceRange: value as [number, number] })
            }
            max={1000}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              {CURRENCY} {params.priceRange?.[0] || 0}
            </span>
            <span>
              {CURRENCY} {params.priceRange?.[1] || 1000}+
            </span>
          </div>
        </div>
      )}

      {/* Category - show for sellers and listings */}
      {(params.searchType === 'sellers' ||
        params.searchType === 'listings') && (
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Category
          </h3>
          <Select
            value={params.category || 'all'}
            onValueChange={(value) =>
              onParamsChange({ category: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Product Type - show for listings */}
      {params.searchType === 'listings' && (
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Product Type
          </h3>
          <Select
            value={params.productType || 'all'}
            onValueChange={(value) =>
              onParamsChange({ productType: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Product Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Product Types</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Service Mode - show for sellers and listings */}
      {(params.searchType === 'sellers' ||
        params.searchType === 'listings') && (
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
            Service Mode
          </h3>
          <Select
            value={params.serviceMode || 'all'}
            onValueChange={(value) =>
              onParamsChange({ serviceMode: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="home_service">Home Service</SelectItem>
              <SelectItem value="in_store">In-store</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Sort By
        </h3>
        <Select
          value={params.sortBy || 'relevance'}
          onValueChange={(value) =>
            onParamsChange({ sortBy: value as SearchParams['sortBy'] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="proximity">Nearest</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            {params.searchType === 'listings' && (
              <>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Distance - Show for location-based searches */}
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
          Distance
        </h3>
        <Slider
          value={[params.distance || 50]}
          onValueChange={(value) => onParamsChange({ distance: value[0] })}
          max={50}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>0 mi</span>
          <span>50 mi</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          Current: {params.distance || 50} miles
        </p>
      </div>
    </div>
  );
}
