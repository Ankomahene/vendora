'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Package, Plus } from 'lucide-react';

interface EmptyListingsProps {
  hasListings: boolean;
  searchQuery?: string;
}

export function EmptyListings({
  hasListings,
  searchQuery,
}: EmptyListingsProps) {
  if (hasListings && searchQuery) {
    // No results for search query
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-background">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground text-center mb-6">
          We couldn&apos;t find any listings matching &quot;{searchQuery}&quot;.
          <br />
          Try using different keywords or clear your filters.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear Filters
        </Button>
      </div>
    );
  }

  // No listings at all
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-background">
      <Package className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No listings yet</h3>
      <p className="text-muted-foreground text-center mb-6">
        You haven&apos;t created any listings yet.
        <br />
        Start by creating your first listing to showcase your products or
        services.
      </p>
      <Button asChild>
        <Link href="/dashboard/listings/create">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Listing
        </Link>
      </Button>
    </div>
  );
}
