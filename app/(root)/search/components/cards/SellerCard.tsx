'use client';

import { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SellerCardProps {
  seller: UserProfile;
}

export function SellerCard({ seller }: SellerCardProps) {
  const sellerDetails = seller.seller_details;

  if (!sellerDetails) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Business Image/Avatar */}
          <div className="md:w-60 h-40 md:h-full relative bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            {sellerDetails.images && sellerDetails.images.length > 0 ? (
              <Image
                src={sellerDetails.images[0]}
                alt={sellerDetails.business_name}
                className="w-full h-full object-cover"
                width={1000}
                height={1000}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={seller.avatar_url || ''}
                    alt={sellerDetails.business_name}
                  />
                  <AvatarFallback className="text-2xl">
                    {sellerDetails.business_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="p-6 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1">
                  {sellerDetails.business_name}
                </h3>
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {sellerDetails.location?.address ||
                      'Location not specified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 font-medium">4.5</span>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">
                  (24)
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2">
              {sellerDetails.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {sellerDetails.services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {service}
                </Badge>
              ))}
              {sellerDetails.services.length > 3 && (
                <Badge variant="outline" className="font-normal">
                  +{sellerDetails.services.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {sellerDetails.service_modes.map(
                (mode, index) =>
                  mode.enabled && (
                    <Badge
                      key={index}
                      variant="outline"
                      className="font-normal"
                    >
                      {mode.type === 'home_service'
                        ? 'Home Service'
                        : mode.type === 'in_store'
                          ? 'In-store'
                          : 'Delivery'}
                    </Badge>
                  )
              )}
            </div>

            <div className="flex space-x-2 mt-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/sellers/${seller.id}`}>
                  View Profile
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
