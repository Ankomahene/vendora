import Link from 'next/link';

export const metadata = {
  title: 'Categories | Vendora',
  description: 'Browse products by category',
};

// Mock categories data
const mockCategories = [
  {
    id: '1',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Handcrafted and modern furniture for your home',
    icon_url: '/images/categories/furniture.png',
    product_count: 42,
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description:
      'Clothing, accessories, and jewelry from independent designers',
    icon_url: '/images/categories/fashion.png',
    product_count: 78,
  },
  {
    id: '3',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Beautiful items to make your house a home',
    icon_url: '/images/categories/home-decor.png',
    product_count: 56,
  },
  {
    id: '4',
    name: 'Art & Collectibles',
    slug: 'art-collectibles',
    description: 'Unique pieces from artists and collectors worldwide',
    icon_url: '/images/categories/art.png',
    product_count: 34,
  },
  {
    id: '5',
    name: 'Craft Supplies',
    slug: 'craft-supplies',
    description: 'Tools and materials for your DIY projects',
    icon_url: '/images/categories/craft.png',
    product_count: 29,
  },
  {
    id: '6',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Natural and handmade personal care products',
    icon_url: '/images/categories/beauty.png',
    product_count: 23,
  },
  {
    id: '7',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, accessories, and tech innovations',
    icon_url: '/images/categories/electronics.png',
    product_count: 18,
  },
  {
    id: '8',
    name: 'Books & Stationery',
    slug: 'books-stationery',
    description: 'Handmade journals, cards, and unique books',
    icon_url: '/images/categories/books.png',
    product_count: 31,
  },
];

export default function CategoriesPage() {
  const categoriesWithCount = mockCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriesWithCount.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex flex-col items-center text-center">
              {category.icon_url ? (
                <img
                  src={category.icon_url}
                  alt={category.name}
                  className="w-16 h-16 object-contain mb-4"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-muted-foreground">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              <h3 className="font-medium text-lg mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {category.description}
                </p>
              )}
              <span className="text-xs text-muted-foreground">
                {category.product_count}{' '}
                {category.product_count === 1 ? 'product' : 'products'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {categoriesWithCount.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            Categories will appear here once added by administrators
          </p>
        </div>
      )}
    </div>
  );
}
