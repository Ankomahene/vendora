'use client';

import { Category } from '@/lib/types/category';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Layers } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {category.image ? (
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

          <Badge variant="secondary" className="mt-auto">
            {/* This would dynamically show the count of services in this category */}
            {category.businessCount || 0} businesses
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
