'use client';

import { Listing } from '@/app/dashboard/listings/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import { CURRENCY } from '@/lib/constants';
import Image from 'next/image';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full p-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
            <span className="text-zinc-400 dark:text-zinc-600">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button className="h-8 w-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Heart className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      <CardContent className="px-4 py-0 flex-grow">
        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {listing.location?.address || 'Location not specified'}
          </span>
        </div>

        <div className="mb-1">
          {listing.price !== null && (
            <div className="text-primary font-medium whitespace-nowrap mb-3">
              {CURRENCY} {listing.price.toFixed(2)}
            </div>
          )}
          <div>
            <h3 className="font-medium line-clamp-2">{listing.title}</h3>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {listing.service_modes.slice(0, 2).map((mode, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs font-normal"
            >
              {mode === 'home_service'
                ? 'Home Service'
                : mode === 'in_store'
                  ? 'In-store'
                  : 'Delivery'}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-800">
        <Link
          href={`/products/${listing.id}`}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors w-full text-center"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
