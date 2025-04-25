import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilters } from '@/lib/types';

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  className,
}: SearchFiltersPanelProps) {
  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-6 ${className}`}
    >
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
          Price Range
        </h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>$0</span>
          <span>$1000+</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Category
        </h3>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Service Mode
        </h3>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="pickup">Pickup</SelectItem>
            <SelectItem value="onsite">On-site Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Sort By
        </h3>
        <Select defaultValue="relevance">
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="proximity">Nearest</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
          Distance
        </h3>
        <Slider defaultValue={[5]} max={50} step={1} className="mb-2" />
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>0 mi</span>
          <span>50 mi</span>
        </div>
      </div>
    </div>
  );
}
