/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { EnhancedCategory } from './CategoriesClient';

interface CategoryCardProps {
  category: EnhancedCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
    >
      <div className="p-6 flex flex-col items-center text-center">
        {category.image ? (
          <img
            src={category.image}
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
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">
            {category.businessCount}{' '}
            {category.businessCount === 1 ? 'business' : 'businesses'}
          </Badge>
          <Badge variant="outline">
            {category.listingCount}{' '}
            {category.listingCount === 1 ? 'listing' : 'listings'}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
