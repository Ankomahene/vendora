import Link from 'next/link';

export const metadata = {
  title: 'All Products | Vendora',
  description: 'Browse all products from our talented sellers',
};

// Mock products data
const mockProducts = [
  {
    id: '1',
    title: 'Handcrafted Wooden Chair',
    price: 149.99,
    description:
      'Beautiful handcrafted wooden chair made from sustainable oak wood.',
    images: ['/images/products/chair-1.jpg'],
    created_at: '2023-09-15T10:30:00Z',
    profiles: {
      id: '101',
      full_name: 'John Woodworks',
      avatar_url: '/images/avatars/seller-1.jpg',
    },
  },
  {
    id: '2',
    title: 'Vintage Leather Messenger Bag',
    price: 89.95,
    description:
      'Stylish vintage leather messenger bag with multiple compartments.',
    images: ['/images/products/bag-1.jpg'],
    created_at: '2023-09-12T14:20:00Z',
    profiles: {
      id: '102',
      full_name: 'Leather Crafts Co.',
      avatar_url: '/images/avatars/seller-2.jpg',
    },
  },
  {
    id: '3',
    title: 'Handmade Ceramic Mug Set',
    price: 36.5,
    description: 'Set of 4 handmade ceramic mugs, each with unique pattern.',
    images: ['/images/products/mugs-1.jpg'],
    created_at: '2023-09-10T09:15:00Z',
    profiles: {
      id: '103',
      full_name: 'Ceramic Arts Studio',
      avatar_url: '/images/avatars/seller-3.jpg',
    },
  },
  {
    id: '4',
    title: 'Natural Soy Wax Candles',
    price: 24.99,
    description:
      'Set of 3 scented soy wax candles in reusable glass containers.',
    images: ['/images/products/candles-1.jpg'],
    created_at: '2023-09-05T16:45:00Z',
    profiles: {
      id: '104',
      full_name: 'Glow & Scent',
      avatar_url: '/images/avatars/seller-4.jpg',
    },
  },
  {
    id: '5',
    title: 'Organic Cotton T-Shirt',
    price: 29.95,
    description:
      'Eco-friendly organic cotton t-shirt, available in multiple colors.',
    images: ['/images/products/tshirt-1.jpg'],
    created_at: '2023-09-02T11:30:00Z',
    profiles: {
      id: '105',
      full_name: 'Eco Apparel',
      avatar_url: '/images/avatars/seller-5.jpg',
    },
  },
  {
    id: '6',
    title: 'Handcrafted Leather Wallet',
    price: 49.99,
    description:
      'Durable leather wallet with multiple card slots and bill compartment.',
    images: ['/images/products/wallet-1.jpg'],
    created_at: '2023-08-28T13:20:00Z',
    profiles: {
      id: '102',
      full_name: 'Leather Crafts Co.',
      avatar_url: '/images/avatars/seller-2.jpg',
    },
  },
  {
    id: '7',
    title: 'Customizable Wall Art',
    price: 75.0,
    description: 'Personalized wall art, perfect for home decoration or gift.',
    images: ['/images/products/art-1.jpg'],
    created_at: '2023-08-25T10:10:00Z',
    profiles: {
      id: '106',
      full_name: 'Creative Canvas',
      avatar_url: '/images/avatars/seller-6.jpg',
    },
  },
  {
    id: '8',
    title: 'Handmade Soap Collection',
    price: 32.5,
    description:
      'Set of 5 handmade soaps with natural ingredients and essential oils.',
    images: ['/images/products/soap-1.jpg'],
    created_at: '2023-08-20T09:40:00Z',
    profiles: {
      id: '107',
      full_name: 'Natural Bath Co.',
      avatar_url: '/images/avatars/seller-7.jpg',
    },
  },
];

export default function ProductsPage() {
  const products = mockProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>

        <div className="flex items-center space-x-2">
          <select className="rounded-md border-input bg-background px-3 py-1 text-sm">
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              <div className="aspect-square w-full relative overflow-hidden">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
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
                  {product.title}
                </h3>
                <p className="text-primary font-bold">${product.price}</p>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-muted overflow-hidden mr-2">
                      {product.profiles?.avatar_url && (
                        <img
                          src={product.profiles.avatar_url}
                          alt={product.profiles.full_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.profiles?.full_name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Check back later for new listings
          </p>
        </div>
      )}
    </div>
  );
}
