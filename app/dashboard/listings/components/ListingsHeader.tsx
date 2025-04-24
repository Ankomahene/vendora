'use client';

import { useProfileServices } from '@/lib/hooks';

export function ListingsHeader() {
  const { user: profile } = useProfileServices();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
      <p className="text-muted-foreground mt-1">
        Manage your listings in the{' '}
        {profile?.seller_details?.business_name || 'Vendora'} marketplace
      </p>
    </div>
  );
}
