'use client';

import { SearchParams, SearchResult } from '@/services/search/searchService';
import { SellerCard } from './cards/SellerCard';
import { ListingCard } from './cards/ListingCard';
import { CategoryCard } from './cards/CategoryCard';
import { ProductTypeCard } from './cards/ProductTypeCard';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  searchType: SearchParams['searchType'];
  results: SearchResult;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  searchType,
  results,
  currentPage,
  onPageChange,
}: SearchResultsProps) {
  // Determine the total pages based on the total results (assuming 10 per page)
  const totalPages = Math.ceil(results.totalResults / 10);

  // Handle empty state
  if (results.totalResults === 0) {
    return <EmptyState type={searchType} />;
  }

  return (
    <div className="space-y-6">
      {/* Sellers Results */}
      {searchType === 'sellers' && (
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          {results.sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      )}

      {/* Listings Results */}
      {searchType === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Categories Results */}
      {searchType === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* Product Types Results */}
      {searchType === 'product_types' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.productTypes.map((productType) => (
            <ProductTypeCard key={productType.id} productType={productType} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* First Page */}
            {currentPage > 2 && (
              <Button
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
            )}

            {/* Ellipsis if needed */}
            {currentPage > 3 && (
              <Button variant="outline" size="icon" disabled>
                ...
              </Button>
            )}

            {/* Page before current */}
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
              >
                {currentPage - 1}
              </Button>
            )}

            {/* Current Page */}
            <Button variant="default" size="icon">
              {currentPage}
            </Button>

            {/* Page after current */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </Button>
            )}

            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && (
              <Button variant="outline" size="icon" disabled>
                ...
              </Button>
            )}

            {/* Last Page */}
            {currentPage < totalPages - 1 && (
              <Button
                variant={currentPage === totalPages ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
