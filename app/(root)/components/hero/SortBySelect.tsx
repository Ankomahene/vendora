import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SortBySelect = ({
  sortBy,
  setSortBy,
  searchType,
}: {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchType: string;
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Sort By
      </h3>
      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="proximity">Nearest</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          {searchType === 'listings' && (
            <>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
