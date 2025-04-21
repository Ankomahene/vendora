export type SearchType = 'sellers' | 'listings' | 'categories';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  description: string;
  serviceModes: string[];
  listings: Listing[];
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  category: string;
  distance: string;
  serviceMode: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
  description: string;
}

export interface SearchFilters {
  priceRange: [number, number];
  category: string;
  serviceMode: string;
  distance: number;
  location: string;
  sortBy: 'relevance' | 'proximity' | 'newest' | 'price_asc' | 'price_desc';
}