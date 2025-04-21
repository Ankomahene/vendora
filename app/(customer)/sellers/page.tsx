import Link from 'next/link';

export const metadata = {
  title: 'Sellers | Vendora',
  description: 'Browse our trusted sellers on Vendora marketplace',
};

// Mock sellers data
const mockSellers = [
  {
    id: '101',
    full_name: 'John Woodworks',
    business_name: 'Woodcraft Creations',
    seller_description:
      'Handcrafted wooden furniture made with sustainable materials and traditional techniques.',
    avatar_url: '/images/avatars/seller-1.jpg',
    location: 'Portland, OR',
    seller_joined_at: '2022-05-12T15:30:00Z',
    seller_rating: 4.8,
    product_count: 24,
  },
  {
    id: '102',
    full_name: 'Sarah Thompson',
    business_name: 'Leather Crafts Co.',
    seller_description:
      'Premium leather goods handcrafted with traditional methods and high-quality materials.',
    avatar_url: '/images/avatars/seller-2.jpg',
    location: 'Austin, TX',
    seller_joined_at: '2022-06-23T09:15:00Z',
    seller_rating: 4.9,
    product_count: 31,
  },
  {
    id: '103',
    full_name: 'Maria Rodriguez',
    business_name: 'Ceramic Arts Studio',
    seller_description:
      'Unique ceramic pieces that combine functionality with artistic expression.',
    avatar_url: '/images/avatars/seller-3.jpg',
    location: 'Santa Fe, NM',
    seller_joined_at: '2022-03-18T11:45:00Z',
    seller_rating: 4.7,
    product_count: 18,
  },
  {
    id: '104',
    full_name: 'Emma Wilson',
    business_name: 'Glow & Scent',
    seller_description:
      'Handmade candles and aromatherapy products made with natural ingredients.',
    avatar_url: '/images/avatars/seller-4.jpg',
    location: 'Seattle, WA',
    seller_joined_at: '2022-08-05T14:20:00Z',
    seller_rating: 4.6,
    product_count: 15,
  },
  {
    id: '105',
    full_name: 'David Chen',
    business_name: 'Eco Apparel',
    seller_description:
      'Sustainable clothing made with organic materials and eco-friendly production methods.',
    avatar_url: '/images/avatars/seller-5.jpg',
    location: 'San Francisco, CA',
    seller_joined_at: '2022-07-14T10:30:00Z',
    seller_rating: 4.5,
    product_count: 22,
  },
  {
    id: '106',
    full_name: 'Lisa Johnson',
    business_name: 'Creative Canvas',
    seller_description: 'Custom artwork and wall decor for homes and offices.',
    avatar_url: '/images/avatars/seller-6.jpg',
    location: 'Chicago, IL',
    seller_joined_at: '2022-04-29T13:15:00Z',
    seller_rating: 4.8,
    product_count: 19,
  },
];

export default function SellersPage() {
  const sellersWithCount = mockSellers;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Sellers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellersWithCount.map((seller) => (
          <Link
            key={seller.id}
            href={`/sellers/${seller.id}`}
            className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mr-4">
                  {seller.avatar_url ? (
                    <img
                      src={seller.avatar_url}
                      alt={seller.business_name || seller.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl text-muted-foreground">
                        {(seller.business_name || seller.full_name).charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-lg">
                    {seller.business_name || seller.full_name}
                  </h3>
                  {seller.seller_rating && (
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={
                              star <= Math.round(seller.seller_rating)
                                ? 'currentColor'
                                : 'none'
                            }
                            stroke="currentColor"
                            className={`w-4 h-4 ${
                              star <= Math.round(seller.seller_rating)
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
                      </div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {seller.seller_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {seller.seller_description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {seller.seller_description}
                </p>
              )}

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {seller.product_count}{' '}
                  {seller.product_count === 1 ? 'product' : 'products'}
                </span>
                {seller.location && <span>{seller.location}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sellersWithCount.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No sellers found</h3>
          <p className="text-muted-foreground">
            Sellers will appear here once they join and are approved
          </p>
        </div>
      )}
    </div>
  );
}
