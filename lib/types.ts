export type SearchType = 'sellers' | 'listings' | 'categories';

// used for mocked data. do not use this
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

// used for mocked data. do not use this
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

// used for mocked data. do not use this
export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
  description: string;
}

// used for mocked data. do not use this
export interface SearchFilters {
  priceRange: [number, number];
  category: string;
  serviceMode: string;
  distance: number;
  location: string;
  sortBy: 'relevance' | 'proximity' | 'newest' | 'price_asc' | 'price_desc';
}

export type UserRole = 'buyer' | 'seller' | 'admin';
export type SellerStatus = 'pending' | 'approved' | 'rejected';

export interface ServiceMode {
  type: 'delivery' | 'home_service' | 'in_store';
  enabled: boolean;
}

export interface PlaceComponents {
  country?: string;
  region?: string;
  district?: string;
  place?: string;
  locality?: string;
  neighborhood?: string;
  address?: string;
  postcode?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
  placeComponents?: PlaceComponents;
}

export interface SellerDetails {
  business_name: string;
  business_category: string;
  description: string;
  contact_phone: string;
  services: string[];
  service_modes: ServiceMode[];
  location: Location;
  images: string[];
}

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role: UserRole;
  seller_status?: SellerStatus;
  is_admin: boolean;
  first_login: boolean;
  created_at: string;
  updated_at: string;
  seller_details: SellerDetails;
};

export interface DashboardStats {
  totalListings: number;
  totalViews: number;
  totalMessages: number;
  pendingReviews: number;
}
