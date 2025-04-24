import { Location } from '@/lib/types';

export type ServiceMode = 'delivery' | 'home_service' | 'in_store';

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  tags?: string[];
  service_modes: ServiceMode[];
  location: Location;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position: number;
}
