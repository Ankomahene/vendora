import { Product } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { CURRENCY } from '@/lib/constants';

interface CategoryProductsProps {
  products: Product[];
  categoryName: string;
}

export function CategoryProducts({
  products,
  categoryName,
}: CategoryProductsProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No Products Found</h3>
        <p className="text-muted-foreground">
          There are no products available in the {categoryName} category yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-md font-medium mb-6 text-muted-foreground">
        {products.length} Products in {categoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative aspect-square w-full">
          {product.images && product.images.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {product.discount_percentage && (
            <Badge className="absolute top-2 right-2 bg-primary text-white">
              {product.discount_percentage}% OFF
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-medium line-clamp-2 mb-1">
            {product.title}
          </h3>

          <div className="flex items-center mt-1">
            <span className="text-lg font-bold text-primary">
              {CURRENCY} {product.price}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                {CURRENCY} {product.original_price}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {product.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
