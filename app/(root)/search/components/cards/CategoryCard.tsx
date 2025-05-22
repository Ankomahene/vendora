'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/types/category';
import { Layers } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 mb-4 object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="h-8 w-8 text-primary" />
            </div>
          )}

          <h3 className="font-medium text-lg mb-2">{category.name}</h3>

          {category.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
