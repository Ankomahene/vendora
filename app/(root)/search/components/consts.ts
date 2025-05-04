import { SearchType } from '@/services/search/searchService';

export const SearchTypeMap: Record<SearchType, string> = {
  sellers: 'Businesses',
  listings: 'Products',
  categories: 'Categories',
  product_types: 'Product Types',
};
