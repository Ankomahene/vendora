/* eslint-disable @next/next/no-img-element */
'use client';

import { Category } from '@/lib/types/category';

interface CategoryImageProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryImage({ category, size = 'sm' }: CategoryImageProps) {
  const dimensions = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const sizeClass = dimensions[size];

  if (category.image) {
    return (
      <div className={`${sizeClass} relative rounded-md overflow-hidden`}>
        <img
          src={category.image}
          alt={category.name}
          className="object-cover h-full w-full"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} bg-muted flex items-center justify-center rounded-md`}
    >
      <span className="text-[8px] text-muted-foreground">No image</span>
    </div>
  );
}
