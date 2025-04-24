'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '../types';

// Function to fetch seller listings
async function fetchSellerListings(sellerId: string): Promise<Listing[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching listings: ${error.message}`);
  }

  return data || [];
}

export function useSellerListings(sellerId: string) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: listings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sellerListings', sellerId],
    queryFn: () => fetchSellerListings(sellerId),
    enabled: mounted && !!sellerId,
  });

  return {
    listings,
    isLoading,
    error,
    refetch,
  };
}
