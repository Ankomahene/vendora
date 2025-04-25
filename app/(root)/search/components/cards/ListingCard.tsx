/* eslint-disable @next/next/no-img-element */
'use client';

import { Listing } from '@/app/dashboard/listings/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import { CURRENCY } from '@/lib/constants';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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

      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-medium line-clamp-2">{listing.title}</h3>
          </div>
          {listing.price !== null && (
            <div className="text-primary font-medium ml-2 whitespace-nowrap">
              {CURRENCY}
              {listing.price.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {listing.location?.address || 'Location not specified'}
          </span>
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
          {listing.tags?.slice(0, 1).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-800">
        <Link
          href={`/listings/${listing.id}`}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors w-full text-center"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
