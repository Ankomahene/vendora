import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Mock product data
const mockProducts = {
  '1': {
    id: '1',
    title: 'Handcrafted Wooden Chair',
    price: 149.99,
    original_price: null,
    discount_percentage: null,
    description:
      'Beautiful handcrafted wooden chair made from sustainable oak wood. Each piece is carefully constructed with traditional woodworking techniques. Perfect for dining rooms or as an accent chair.',
    images: [
      '/images/products/chair-1.jpg',
      '/images/products/chair-2.jpg',
      '/images/products/chair-3.jpg',
    ],
    seller_id: '101',
    category_id: '1',
    status: 'active',
    specifications: {
      material: 'Oak Wood',
      dimensions: '35" H x 20" W x 22" D',
      weight: '15 lbs',
      finish: 'Natural Wood Oil',
      assembly_required: 'No',
    },
    profiles: {
      id: '101',
      full_name: 'John Woodworks',
      business_name: 'Woodcraft Creations',
      avatar_url: '/images/avatars/seller-1.jpg',
      seller_rating: 4.8,
      location: 'Portland, OR',
    },
    categories: {
      id: '1',
      name: 'Furniture',
      slug: 'furniture',
    },
  },
  '2': {
    id: '2',
    title: 'Vintage Leather Messenger Bag',
    price: 89.95,
    original_price: null,
    discount_percentage: null,
    description:
      'Stylish vintage leather messenger bag with multiple compartments. Made with genuine leather that develops a beautiful patina over time. Features adjustable shoulder strap and secure closures.',
    images: ['/images/products/bag-1.jpg', '/images/products/bag-2.jpg'],
    seller_id: '102',
    category_id: '2',
    status: 'active',
    specifications: {
      material: 'Genuine Leather',
      dimensions: '11" H x 15" W x 4" D',
      pockets: '4 interior, 2 exterior',
      color: 'Brown',
      closure: 'Buckle and Magnetic Snap',
    },
    profiles: {
      id: '102',
      full_name: 'Sarah Thompson',
      business_name: 'Leather Crafts Co.',
      avatar_url: '/images/avatars/seller-2.jpg',
      seller_rating: 4.9,
      location: 'Austin, TX',
    },
    categories: {
      id: '2',
      name: 'Fashion',
      slug: 'fashion',
    },
  },
};

// Mock related products
const mockRelatedProducts = [
  {
    id: '3',
    title: 'Handmade Ceramic Mug Set',
    price: 36.5,
    images: ['/images/products/mugs-1.jpg'],
    categories: {
      name: 'Home Decor',
    },
  },
  {
    id: '4',
    title: 'Natural Soy Wax Candles',
    price: 24.99,
    images: ['/images/products/candles-1.jpg'],
    categories: {
      name: 'Home Decor',
    },
  },
  {
    id: '7',
    title: 'Customizable Wall Art',
    price: 75.0,
    images: ['/images/products/art-1.jpg'],
    categories: {
      name: 'Art & Collectibles',
    },
  },
  {
    id: '6',
    title: 'Handcrafted Leather Wallet',
    price: 49.99,
    images: ['/images/products/wallet-1.jpg'],
    categories: {
      name: 'Fashion',
    },
  },
];

export async function generateMetadata({ params }: ProductPageProps) {
  const productId = params.id;
  const product = mockProducts[productId as keyof typeof mockProducts];

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

export default function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  const product = mockProducts[productId as keyof typeof mockProducts];

  if (!product) {
    notFound();
  }

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

  // Related products
  const relatedProducts = mockRelatedProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Product images */}
        <div>
          <div className="bg-card rounded-lg overflow-hidden mb-4">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full aspect-square object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md overflow-hidden border"
                >
                  <img
                    src={image}
                    alt={`${product.title} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.categories && (
            <Link
              href={`/categories/${product.categories.slug}`}
              className="text-sm text-primary hover:underline mb-2 inline-block"
            >
              {product.categories.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          {/* Pricing */}
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-primary mr-3">
              ${product.price}
            </span>

            {discountAmount > 0 && (
              <>
                <span className="text-muted-foreground line-through mr-2">
                  ${originalPrice}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                  {product.discount_percentage
                    ? `${product.discount_percentage}% OFF`
                    : `$${discountAmount} OFF`}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert mb-6">
            <p>{product.description}</p>
          </div>

          {/* Additional details */}
          {product.specifications && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <span className="font-medium capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-muted-foreground">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Contact Seller
            </Button>
          </div>

          {/* Seller info */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden mr-4">
                {product.profiles?.avatar_url ? (
                  <img
                    src={product.profiles.avatar_url}
                    alt={
                      product.profiles.business_name ||
                      product.profiles.full_name
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg text-muted-foreground">
                      {(
                        product.profiles?.business_name ||
                        product.profiles?.full_name ||
                        ''
                      ).charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium">
                  {product.profiles?.business_name ||
                    product.profiles?.full_name}
                </h3>

                {product.profiles?.seller_rating && (
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={
                          star <= Math.round(product.profiles.seller_rating)
                            ? 'currentColor'
                            : 'none'
                        }
                        stroke="currentColor"
                        className={`w-4 h-4 ${
                          star <= Math.round(product.profiles.seller_rating)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">
                      {product.profiles.seller_rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {product.profiles?.location && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {product.profiles.location}
                  </div>
                )}
              </div>

              <div className="ml-auto">
                <Link href={`/sellers/${product.seller_id}`}>
                  <Button variant="outline" size="sm">
                    View Shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full relative overflow-hidden">
                  {relatedProduct.images && relatedProduct.images[0] ? (
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 truncate">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-primary font-bold">
                    ${relatedProduct.price}
                  </p>
                  {relatedProduct.categories && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedProduct.categories.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
