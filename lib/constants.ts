import { SearchParams } from '@/services';

export const categories = [
  { id: 1, name: 'Restaurants', icon: 'utensils' },
  { id: 2, name: 'Shopping', icon: 'shopping-bag' },
  { id: 3, name: 'Services', icon: 'briefcase' },
  { id: 4, name: 'Real Estate', icon: 'home' },
  { id: 5, name: 'Automotive', icon: 'car' },
  { id: 6, name: 'Health', icon: 'heart-pulse' },
  { id: 7, name: 'Beauty', icon: 'scissors' },
  { id: 8, name: 'Entertainment', icon: 'film' },
];

export const featuredVendors = [
  {
    id: 1,
    name: 'Coastal Cafe',
    category: 'Restaurants',
    rating: 4.8,
    reviews: 124,
    distance: '0.4 mi',
    image:
      'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Downtown',
  },
  {
    id: 2,
    name: 'Urban Threads',
    category: 'Shopping',
    rating: 4.6,
    reviews: 89,
    distance: '0.8 mi',
    image:
      'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Fashion District',
  },
  {
    id: 3,
    name: 'Serene Spa',
    category: 'Beauty',
    rating: 4.9,
    reviews: 201,
    distance: '1.2 mi',
    image:
      'https://images.pexels.com/photos/3865557/pexels-photo-3865557.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Riverside',
  },
  {
    id: 4,
    name: 'Tech Repair Pro',
    category: 'Services',
    rating: 4.7,
    reviews: 112,
    distance: '0.9 mi',
    image:
      'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'City Center',
  },
];

export const trendingCategories = [
  {
    id: 1,
    name: 'Food & Dining',
    count: 342,
    image:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Home Services',
    count: 186,
    image:
      'https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Fitness & Wellness',
    count: 124,
    image:
      'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    name: 'Electronics',
    count: 98,
    image:
      'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    comment:
      'Vendora helped me connect with local customers I never would have reached otherwise. My business has grown 30% since joining!',
    avatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Mark Williams',
    role: 'Frequent Shopper',
    comment:
      'I love being able to discover unique local businesses in my area. The map feature makes it so easy to find exactly what I need.',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Freelance Designer',
    comment:
      'As someone who moves frequently for work, Vendora is my go-to for finding trusted services in new neighborhoods.',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
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
export const DEFAULT_SEARCH_RADIUS = 50;

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
