import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SellerDetails, ServiceMode, Location } from '@/lib/types';
import { ChevronLeft, Star, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPreview } from '@/app/dashboard/components/MapPreview';
import { getReadableAddress } from '@/services/get-readable-address';
import { SendMessageButton } from './components/SendMessageButton';
import { ProductsList } from './components/ProductsList';
import { ImageSlider } from './components/ImageSlider';

interface SellerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: SellerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: seller } = await supabase
    .from('profiles')
    .select('seller_details->>business_name, seller_details->>description')
    .eq('id', id)
    .single();

  if (!seller) {
    return {
      title: 'Seller Not Found | Vendora',
      description: 'The requested seller could not be found.',
    };
  }

  return {
    title: `${seller.business_name} | Sellers | Vendora`,
    description: seller.description || `${seller.business_name} on Vendora.`,
  };
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch seller details and their listings in a single query
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      listings:listings(*)
    `
    )
    .eq('id', id)
    .eq('listings.is_active', true)
    .single();

  if (
    error ||
    !data ||
    data.role !== 'seller' ||
    data.seller_status !== 'approved'
  ) {
    console.error('Error fetching seller data:', error);
    notFound();
  }

  const profile = data;
  const products = data.listings || [];
  const sellerDetails = profile.seller_details as SellerDetails;

  // get business category
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', sellerDetails.business_category)
    .single();

  console.log(category);

  const response = await getReadableAddress(
    sellerDetails.location.lng,
    sellerDetails.location.lat
  );
  const locationData = await response.json();
  const placeName = locationData.features[0]?.place_name;

  const location: Location = {
    ...sellerDetails.location,
    name: placeName,
    address: placeName,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/sellers">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Sellers
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card dark:bg-zinc-800 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex flex-col gap-6">
              <ImageSlider
                images={sellerDetails.images || []}
                businessName={sellerDetails.business_name}
              />

              <div>
                <h1 className="text-3xl font-bold">
                  {sellerDetails.business_name}
                </h1>
                <div className="flex items-center mt-2 text-amber-500">
                  <Star className="fill-current h-5 w-5" />
                  <span className="ml-1 font-medium">
                    {profile.seller_rating || 'New'}{' '}
                    {profile.seller_rating && (
                      <span className="text-muted-foreground">
                        ({profile.seller_reviews_count || 0} reviews)
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {category?.name}
                  </span>
                  {sellerDetails.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground">
                {sellerDetails.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Service Modes</h3>
                <div className="space-y-2">
                  {sellerDetails.service_modes.map(
                    (mode: ServiceMode, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span className="capitalize">
                          {mode.type.replace('_', ' ')}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Contact</h3>
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{sellerDetails.contact_phone}</span>
                </div>
                <div className="mt-4">
                  <SendMessageButton />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="products" className="mb-8">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <ProductsList products={products || []} />
            </TabsContent>
            <TabsContent value="reviews">
              <div className="p-8 text-center">
                <h3 className="text-xl font-medium mb-2">
                  Reviews Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We&apos;re working on adding reviews for sellers. Check back
                  soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <MapPreview location={location} isInteractive={true} />
        </div>
      </div>
    </div>
  );
}
