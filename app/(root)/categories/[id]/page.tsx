import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('categories')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!data) {
    return {
      title: 'Category Not Found | Vendora',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${data.name} | Categories | Vendora`,
    description:
      data.description ||
      `Browse ${data.name} products and services on Vendora.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/categories">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-32 h-32 object-contain"
            />
          ) : (
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">
                {category.name.charAt(0)}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground mt-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Products Coming Soon</h2>
        <p className="text-muted-foreground">
          We&apos;re working on adding products to this category. Check back
          soon!
        </p>
      </div>
    </div>
  );
}
