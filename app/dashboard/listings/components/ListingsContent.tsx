'use client';

import { useState } from 'react';
import { useSellerListings } from '../hooks/useSellerListings';
import { ListingCard } from './ListingCard';
import { EmptyListings } from './EmptyListings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListingsHeader } from './ListingsHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ListingFilters } from './ListingFilters';
import Link from 'next/link';

interface ListingsContentProps {
  userId: string;
}

export function ListingsContent({ userId }: ListingsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { listings, isLoading, error } = useSellerListings(userId);

  // Filter and sort listings
  const filteredListings = listings
    ?.filter((listing) => {
      const matchesSearch = searchQuery
        ? listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory =
        filterCategory === 'all' || listing.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === 'oldest') {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === 'price_high') {
        return (b.price || 0) - (a.price || 0);
      } else if (sortBy === 'price_low') {
        return (a.price || 0) - (b.price || 0);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <ListingsHeader />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your listings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Filter listings"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ListingFilters
                selectedCategory={filterCategory}
                onCategoryChange={setFilterCategory}
              />
            </SheetContent>
          </Sheet>

          <Button asChild>
            <Link href="/dashboard/listings/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Something went wrong. Please try again later.
          </p>
        </div>
      ) : filteredListings && filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyListings
          hasListings={!!listings?.length}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
