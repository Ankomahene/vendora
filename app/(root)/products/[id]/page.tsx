import { LocationWithDirections } from '@/components/LocationWithDirections';
import { ContactSellerButton } from '@/components/messaging';
import { ProductTags } from '@/components/ProductTags';
import { ProductType } from '@/components/ProductType';
import { ServiceModes } from '@/components/ServiceModes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CURRENCY } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductImages } from './components/ProductImages';
import { ProductReviews } from './components/ProductReviews';
import { ProductSpecifications } from './components/ProductSpecifications';
import { RelatedProducts } from './components/RelatedProducts';
import { SellerInfoCard } from './components/SellerInfoCard';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('listings')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found',
    };
  }

  return {
    title: `${product.title} | Vendora`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch product details
  const { data: product } = await supabase
    .from('listings')
    .select('*, profile: profiles(seller_details)')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch product type information
  let productType = null;
  if (product.product_type) {
    const { data: typeData } = await supabase
      .from('product_types')
      .select('*')
      .eq('id', product.product_type)
      .single();

    productType = typeData;
  }

  // Fetch product reviews
  const { data: reviews } = await supabase
    .from('product_reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', id)
    .order('created_at', { ascending: false });

  // Fetch related products (by same product type)
  const { data: relatedProducts } = await supabase
    .from('listings')
    .select('*')
    .eq('product_type', product.product_type)
    .neq('id', id)
    .eq('is_active', true)
    .limit(4);

  // Calculate average rating
  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Calculate discount if applicable
  const discountAmount = product.original_price
    ? product.original_price - product.price
    : product.discount_percentage
    ? Math.round(product.price * (product.discount_percentage / 100))
    : 0;

  const originalPrice =
    product.original_price ||
    (product.discount_percentage
      ? Math.round(product.price / (1 - product.discount_percentage / 100))
      : product.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search?type=products">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to all products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left column: Product images and tags */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product images */}
          <div className="mx-auto">
            <ProductImages images={product.images} title={product.title} />
          </div>

          {/* Product type and tags */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {productType && <ProductType type={productType} />}

            {product.tags && product.tags.length > 0 && (
              <ProductTags tags={product.tags} className="md:ml-auto" />
            )}
          </div>

          {/* Service modes */}
          {product.service_modes && product.service_modes.length > 0 && (
            <ServiceModes modes={product.service_modes} />
          )}

          {/* Product location */}
          {product.location && (
            <div>
              <h3 className="text-sm font-medium mb-2">Product Location</h3>
              <LocationWithDirections location={product.location} />
            </div>
          )}
        </div>

        {/* Right column: Product info and seller details */}
        <div>
          {product.categories && (
            <Link
              href={`/categories/${product.categories.id}`}
              className="text-sm text-primary hover:underline mb-2 inline-block"
            >
              {product.categories.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          {/* Rating summary */}
          <div className="flex items-center mb-4">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {reviews?.length ? `${reviews.length} reviews` : 'No reviews yet'}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold text-primary mr-3">
              {product.price.toFixed(2)} <sup>{CURRENCY}</sup>
            </span>

            {discountAmount > 0 && (
              <>
                <span className="text-muted-foreground line-through mr-2">
                  {originalPrice.toFixed(2)} <sup>{CURRENCY}</sup>
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                  {product.discount_percentage
                    ? `${product.discount_percentage}% OFF`
                    : `$${discountAmount.toFixed(2)} OFF`}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert mb-6">
            <p>{product.description}</p>
          </div>

          {/* Action buttons */}
          <div className="mb-8">
            {user && user.id !== product.seller_id && (
              <ContactSellerButton
                sellerId={product.seller_id}
                listingId={id}
                sellerName={product.profile.seller_details.name}
                sellerAvatar={product.profile.seller_details.avatar}
                listingImage={product.images[0]}
                listingName={product.title}
                listingPrice={product.price.toFixed(2)}
                fullWidth
              />
            )}
          </div>

          {/* Seller info card */}
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">Seller Information</h3>
            <SellerInfoCard seller={product.profile} />
          </div>
        </div>
      </div>

      {/* Tabs for specs and reviews */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews?.length || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="specifications">
          <ProductSpecifications specifications={product.specifications} />
        </TabsContent>
        <TabsContent value="reviews">
          <ProductReviews
            reviews={reviews || []}
            productId={id}
            averageRating={averageRating}
            user={user || null}
            canReview={user?.id !== product.seller_id}
          />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}
