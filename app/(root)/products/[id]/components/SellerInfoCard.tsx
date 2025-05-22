'use client';

import { MapPin, Phone, Star, User, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetDirections } from '@/lib/hooks';

interface SellerInfoCardProps {
  seller: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    seller_rating?: number;
    seller_reviews_count?: number;
    seller_details?: {
      business_name?: string;
      contact_phone?: string;
      location?: {
        lat: number;
        lng: number;
        name: string;
        address: string;
      };
      services?: string[];
    };
  };
}

export function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const { getDirections } = useGetDirections();

  if (!seller) return null;

  const businessName = seller.seller_details?.business_name || seller.full_name;
  const location = seller.seller_details?.location;
  const contactPhone = seller.seller_details?.contact_phone;
  const services = seller.seller_details?.services;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          {seller.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={seller.avatar_url}
              alt={businessName || ''}
              className="w-12 h-12 rounded-full mr-1 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-1 flex-shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <Link
              href={`/sellers/${seller.id}`}
              className="font-medium hover:text-primary hover:underline truncate block"
            >
              {businessName}
            </Link>

            {seller.seller_rating && (
              <div className="flex items-center mt-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm ml-1">
                  {seller.seller_rating}{' '}
                  <span className="text-muted-foreground">
                    ({seller.seller_reviews_count || 0} reviews)
                  </span>
                </span>
              </div>
            )}

            {services && services.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {services.join(', ')}
              </p>
            )}
          </div>
        </div>

        {location && (
          <div className="flex items-start gap-3 pt-3 border-t">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{location.name}</h3>
              <p className="text-sm text-muted-foreground">
                {location.address}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-primary hover:text-primary/80 hover:bg-primary/10"
              onClick={() => getDirections(location)}
              title="Get directions"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        )}

        {contactPhone && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={`tel:${contactPhone}`}
              className="text-sm hover:text-primary hover:underline"
            >
              {contactPhone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
