import { createClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types/category';
import { SearchPageClient } from './components/SearchPageClient';

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    category?: string;
    mode?: string;
    minPrice?: string;
    maxPrice?: string;
    distance?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const initialSearchParams = await searchParams;
  const supabase = await createClient();

  // Fetch categories for filter options
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Fetch product types for filter options
  const { data: productTypes } = await supabase
    .from('product_types')
    .select('*')
    .order('name');

  return (
    <SearchPageClient
      categories={(categories as Category[]) || []}
      productTypes={(productTypes as { id: string; name: string }[]) || []}
      initialSearchParams={initialSearchParams || {}}
    />
  );
}
