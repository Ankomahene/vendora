import { Seller, Listing, Category } from './types';

export const mockSellers: Seller[] = [
  {
    id: '1',
    name: 'Urban Kitchen Co.',
    avatar: 'https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviewCount: 156,
    location: 'Downtown SF',
    distance: '0.8 mi',
    description: 'Artisanal kitchen and dining solutions for modern homes.',
    serviceModes: ['Delivery', 'Pickup'],
    listings: [
      {
        id: '101',
        title: 'Handcrafted Ceramic Plates Set',
        price: 89.99,
        image: 'https://images.pexels.com/photos/6270663/pexels-photo-6270663.jpeg?auto=compress&cs=tinysrgb&w=800',
        seller: {
          id: '1',
          name: 'Urban Kitchen Co.',
          rating: 4.8,
        },
        category: 'Kitchen',
        distance: '0.8 mi',
        serviceMode: 'Delivery',
        tags: ['Ceramic', 'Handmade', 'Kitchen'],
      },
      {
        id: '102',
        title: 'Modern Dining Table',
        price: 599.99,
        image: 'https://images.pexels.com/photos/6207797/pexels-photo-6207797.jpeg?auto=compress&cs=tinysrgb&w=800',
        seller: {
          id: '1',
          name: 'Urban Kitchen Co.',
          rating: 4.8,
        },
        category: 'Furniture',
        distance: '0.8 mi',
        serviceMode: 'Delivery',
        tags: ['Furniture', 'Modern', 'Dining'],
      },
    ],
  },
  {
    id: '2',
    name: 'Green Thumb Gardens',
    avatar: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 203,
    location: 'Mission District',
    distance: '1.2 mi',
    description: 'Professional landscaping and garden maintenance services.',
    serviceModes: ['On-site Service'],
    listings: [
      {
        id: '201',
        title: 'Garden Maintenance Package',
        price: 149.99,
        image: 'https://images.pexels.com/photos/589/garden-grass-lawn-meadow.jpg?auto=compress&cs=tinysrgb&w=800',
        seller: {
          id: '2',
          name: 'Green Thumb Gardens',
          rating: 4.9,
        },
        category: 'Garden',
        distance: '1.2 mi',
        serviceMode: 'On-site Service',
        tags: ['Garden', 'Maintenance', 'Monthly'],
      },
    ],
  },
];

export const mockListings: Listing[] = [
  {
    id: '301',
    title: 'Vintage Leather Armchair',
    price: 399.99,
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: {
      id: '3',
      name: 'Retro Furnishings',
      rating: 4.7,
    },
    category: 'Furniture',
    distance: '2.1 mi',
    serviceMode: 'Pickup',
    tags: ['Vintage', 'Leather', 'Furniture'],
  },
  {
    id: '302',
    title: 'Professional Camera Kit',
    price: 1299.99,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: {
      id: '4',
      name: 'Pro Photo Gear',
      rating: 4.9,
    },
    category: 'Electronics',
    distance: '1.5 mi',
    serviceMode: 'Delivery',
    tags: ['Camera', 'Professional', 'Electronics'],
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Home & Garden',
    count: 1245,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Everything for your home and garden needs',
  },
  {
    id: '2',
    name: 'Electronics',
    count: 867,
    image: 'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Latest gadgets and electronic devices',
  },
  {
    id: '3',
    name: 'Fashion',
    count: 2134,
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Trendy clothing and accessories',
  },
];