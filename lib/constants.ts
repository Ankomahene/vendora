import { SearchParams } from '@/services';

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    comment:
      'Vendora helped me connect with local customers I never would have reached otherwise. My business has grown 30% since joining!',
    avatar:
      'https://images.pexels.com/photos/1769467/pexels-photo-1769467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    name: 'Mark Williams',
    role: 'Frequent Shopper',
    comment:
      'I love being able to discover unique local businesses in my area. The map feature makes it so easy to find exactly what I need.',
    avatar:
      'https://images.pexels.com/photos/2379429/pexels-photo-2379429.jpeg',
  },
  {
    id: 3,
    name: 'Audrey Mandy',
    role: 'Business Owner',
    comment:
      'As someone who moves frequently for work, Vendora is my go-to for finding trusted services in new neighborhoods.',
    avatar:
      'https://images.pexels.com/photos/2523899/pexels-photo-2523899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

// Currency symbol used throughout the application
export const CURRENCY = 'GHS';

// Service modes
export const SERVICE_MODES = [
  { value: 'delivery', label: 'Delivery' },
  { value: 'home_service', label: 'Home Service' },
  { value: 'in_store', label: 'In-store' },
];

// Default pagination limits
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Default search radius in miles
export const DEFAULT_SEARCH_RADIUS = 5;

export const initialSearchState: SearchParams = {
  searchType: 'sellers',
  category: 'all',
  productType: 'all',
  location: null,
  distance: 0,
  sortBy: 'relevance',
  serviceMode: 'all',
  query: '',
  priceRange: [0, 1000],
  limit: 10,
  page: 1,
};
