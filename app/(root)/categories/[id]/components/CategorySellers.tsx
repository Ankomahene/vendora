import { UserProfile, SellerDetails } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';

interface CategorySellersProps {
  sellers: UserProfile[];
  categoryName: string;
}

// Extended interface to include the missing properties
interface SellerWithRatings extends UserProfile {
  seller_rating?: number;
  seller_reviews_count?: number;
}

export function CategorySellers({
  sellers,
  categoryName,
}: CategorySellersProps) {
  if (sellers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No Sellers Found</h3>
        <p className="text-muted-foreground">
          There are no sellers available in the {categoryName} category yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-md font-medium mb-6 text-muted-foreground">
        {sellers.length} Sellers in {categoryName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller as SellerWithRatings} />
        ))}
      </div>
    </div>
  );
}

function SellerCard({ seller }: { seller: SellerWithRatings }) {
  const sellerDetails = seller.seller_details as SellerDetails;

  return (
    <Link href={`/sellers/${seller.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {sellerDetails.images && sellerDetails.images.length > 0 ? (
              <img
                src={sellerDetails.images[0]}
                alt={sellerDetails.business_name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-muted-foreground">
                  {sellerDetails.business_name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xl font-medium">
                {sellerDetails.business_name}
              </h3>

              <div className="flex items-center mt-1 text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <span className="ml-1 text-sm">
                  {seller.seller_rating || 'New'}{' '}
                  {seller.seller_rating && (
                    <span className="text-muted-foreground">
                      ({seller.seller_reviews_count || 0} reviews)
                    </span>
                  )}
                </span>
              </div>

              {sellerDetails.location && sellerDetails.location.address && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">
                    {sellerDetails.location.address}
                  </span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-1">
                {sellerDetails.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-muted rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {sellerDetails.services.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    +{sellerDetails.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
