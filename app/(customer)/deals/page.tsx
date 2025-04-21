import Link from 'next/link';

export const metadata = {
  title: 'Deals & Promotions | Vendora',
  description: 'Discover special deals and promotions from our sellers',
};

// Mock deals data
const mockDeals = [
  {
    id: '1',
    title: 'Handcrafted Wooden Chair',
    price: 119.99,
    original_price: 149.99,
    description:
      'Beautiful handcrafted wooden chair made from sustainable oak wood.',
    images: ['/images/products/chair-1.jpg'],
    discount_percentage: 20,
    discount_end_date: '2023-12-31T23:59:59Z',
    profiles: {
      id: '101',
      full_name: 'John Woodworks',
      business_name: 'Woodcraft Creations',
      avatar_url: '/images/avatars/seller-1.jpg',
    },
  },
  {
    id: '2',
    title: 'Vintage Leather Messenger Bag',
    price: 71.96,
    original_price: 89.95,
    description:
      'Stylish vintage leather messenger bag with multiple compartments.',
    images: ['/images/products/bag-1.jpg'],
    discount_percentage: 20,
    discount_end_date: '2023-12-15T23:59:59Z',
    profiles: {
      id: '102',
      full_name: 'Sarah Thompson',
      business_name: 'Leather Crafts Co.',
      avatar_url: '/images/avatars/seller-2.jpg',
    },
  },
  {
    id: '3',
    title: 'Handmade Ceramic Mug Set',
    price: 25.55,
    original_price: 36.5,
    description: 'Set of 4 handmade ceramic mugs, each with unique pattern.',
    images: ['/images/products/mugs-1.jpg'],
    discount_percentage: 30,
    discount_end_date: '2023-12-20T23:59:59Z',
    profiles: {
      id: '103',
      full_name: 'Maria Rodriguez',
      business_name: 'Ceramic Arts Studio',
      avatar_url: '/images/avatars/seller-3.jpg',
    },
  },
  {
    id: '4',
    title: 'Natural Soy Wax Candles',
    price: 19.99,
    original_price: 24.99,
    description:
      'Set of 3 scented soy wax candles in reusable glass containers.',
    images: ['/images/products/candles-1.jpg'],
    discount_percentage: 20,
    discount_end_date: '2023-12-25T23:59:59Z',
    profiles: {
      id: '104',
      full_name: 'Emma Wilson',
      business_name: 'Glow & Scent',
      avatar_url: '/images/avatars/seller-4.jpg',
    },
  },
  {
    id: '5',
    title: 'Organic Cotton T-Shirt',
    price: 19.95,
    original_price: 29.95,
    description:
      'Eco-friendly organic cotton t-shirt, available in multiple colors.',
    images: ['/images/products/tshirt-1.jpg'],
    discount_percentage: 33,
    discount_end_date: '2023-12-31T23:59:59Z',
    profiles: {
      id: '105',
      full_name: 'David Chen',
      business_name: 'Eco Apparel',
      avatar_url: '/images/avatars/seller-5.jpg',
    },
  },
  {
    id: '6',
    title: 'Handcrafted Leather Wallet',
    price: 39.99,
    original_price: 49.99,
    description:
      'Durable leather wallet with multiple card slots and bill compartment.',
    images: ['/images/products/wallet-1.jpg'],
    discount_percentage: 20,
    discount_end_date: '2023-12-15T23:59:59Z',
    profiles: {
      id: '102',
      full_name: 'Sarah Thompson',
      business_name: 'Leather Crafts Co.',
      avatar_url: '/images/avatars/seller-2.jpg',
    },
  },
];

export default function DealsPage() {
  // Filter deals to only show valid ones (mock function to simulate database filter)
  const currentDate = new Date();
  const validDeals = mockDeals.filter(
    (deal) =>
      !deal.discount_end_date || new Date(deal.discount_end_date) > currentDate
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Deals & Promotions</h1>
      <p className="text-muted-foreground mb-8">
        Limited-time offers from our sellers
      </p>

      {validDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {validDeals.map((deal) => {
            const discountAmount = deal.original_price
              ? deal.original_price - deal.price
              : Math.round(deal.price * (deal.discount_percentage / 100));

            const originalPrice =
              deal.original_price ||
              Math.round(deal.price / (1 - deal.discount_percentage / 100));

            return (
              <Link
                key={deal.id}
                href={`/products/${deal.id}`}
                className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-square w-full relative overflow-hidden">
                    {deal.images && deal.images[0] ? (
                      <img
                        src={deal.images[0]}
                        alt={deal.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    {deal.discount_percentage}% OFF
                  </div>

                  {deal.discount_end_date && (
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs">
                      Ends:{' '}
                      {new Date(deal.discount_end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 truncate">
                    {deal.title}
                  </h3>

                  <div className="flex items-center mb-1">
                    <span className="text-primary font-bold mr-2">
                      ${deal.price}
                    </span>
                    <span className="text-muted-foreground text-sm line-through">
                      ${originalPrice}
                    </span>
                    <span className="ml-auto text-green-600 text-sm">
                      Save ${discountAmount}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {deal.description}
                  </p>

                  <div className="mt-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-muted overflow-hidden mr-2">
                      {deal.profiles?.avatar_url && (
                        <img
                          src={deal.profiles.avatar_url}
                          alt={
                            deal.profiles.business_name ||
                            deal.profiles.full_name
                          }
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {deal.profiles?.business_name || deal.profiles?.full_name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No active deals</h3>
          <p className="text-muted-foreground">
            Check back later for new deals and promotions
          </p>
        </div>
      )}
    </div>
  );
}
