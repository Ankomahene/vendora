'use client';

import { SearchParams, SearchResult } from '@/services/search/searchService';
import { SellerCard } from './cards/SellerCard';
import { ListingCard } from './cards/ListingCard';
import { CategoryCard } from './cards/CategoryCard';
import { ProductTypeCard } from './cards/ProductTypeCard';
import { EmptyState } from './EmptyState';
import { SearchPagination } from './SearchPagination';

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
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-6">
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
      <div className="flex justify-center items-center mt-10">
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
