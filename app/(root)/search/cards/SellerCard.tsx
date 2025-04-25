import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Seller } from '@/lib/types';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {seller.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {seller.rating}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    ({seller.reviewCount} reviews)
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    • {seller.distance}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {seller.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {seller.serviceModes.map((mode) => (
                <Badge key={mode} variant="secondary">
                  {mode}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {seller.listings.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">
              Featured Listings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seller.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="group relative aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="text-sm font-medium truncate">
                      {listing.title}
                    </div>
                    <div className="text-sm">${listing.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
