import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Listing } from '@/lib/types';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 dark:bg-zinc-800/90">
            {listing.serviceMode}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
            {listing.title}
          </h3>
          <span className="text-lg font-semibold text-orange-500 whitespace-nowrap">
            ${listing.price}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {listing.seller.name}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{listing.seller.rating}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {listing.distance} • {listing.category}
        </div>
      </div>
    </div>
  );
}