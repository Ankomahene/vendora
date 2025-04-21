import { useState } from 'react';
import { Search, MapPin, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchType } from '@/lib/types';

export function SearchHeader() {
  const [searchType, setSearchType] = useState<SearchType>('listings');

  return (
    <div className="sticky top-24 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="container py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-4">
            <Select
              value={searchType}
              onValueChange={(value) => setSearchType(value as SearchType)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sellers">Sellers</SelectItem>
                <SelectItem value="listings">Listings</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <Input
                type="text"
                placeholder={`Search ${searchType}...`}
                className="pl-10"
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
                defaultValue="San Francisco, CA"
              />
            </div>

            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              <Sliders size={16} />
              <span>Filters</span>
            </Button>

            <Button className="bg-orange-500 hover:bg-orange-600">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
