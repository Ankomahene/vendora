'use client';

import { useCategories } from '@/lib/hooks/useCategories';
import { CategoryHeader } from './CategoryHeader';
import { CategoryList } from './CategoryList';

export default function CategoriesClient() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="space-y-6">
      <CategoryHeader />
      <CategoryList categories={categories} isLoading={isLoading} />
    </div>
  );
}
