import { useState } from 'react';
import { SearchFilters } from '@/lib/types';
import { mockSellers, mockListings, mockCategories } from '@/lib/mock-data';
import { SellerCard } from './cards/SellerCard';
import { ListingCard } from './cards/ListingCard';
import { CategoryCard } from './cards/CategoryCard';
import { EmptyState } from './EmptyState';

interface SearchResultsProps {
  filters: SearchFilters;
}

export function SearchResults({ filters }: SearchResultsProps) {
  const [searchType] = useState<'sellers' | 'listings' | 'categories'>('sellers');

  if (searchType === 'sellers' && mockSellers.length === 0) {
    return <EmptyState type="sellers" />;
  }

  return (
    <div className="space-y-6">
      {searchType === 'sellers' && (
        <div className="grid grid-cols-1 gap-6">
          {mockSellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      )}

      {searchType === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {searchType === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}