'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import Link from 'next/link';

interface ProductTypeCardProps {
  productType: {
    id: string;
    name: string;
  };
}

export function ProductTypeCard({ productType }: ProductTypeCardProps) {
  return (
    <Link href={`/product-types/${productType.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
            <Tag className="h-6 w-6 text-orange-500" />
          </div>

          <h3 className="font-medium text-lg mb-2">{productType.name}</h3>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Browse listings in this product type
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
