'use client';
import { useCategories } from '@/lib/hooks';
import { EnhancedCategory } from '@/lib/types/category';
import { ArrowUpRight, Map, Search, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

export function CategorySection() {
  const { data: categories } = useCategories();
  const trendingCategories = categories?.slice(0, 4);

  if (!trendingCategories) return null;

  return (
    <section
      id="trending"
      className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900"
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            Explore by Category
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            Browse through our most popular categories to find exactly what
            you&apos;re looking for in your neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureBox
            icon="search"
            title="Discover"
            description="Find the best local businesses, services, and products in your area with our powerful search tools."
          />
          <FeatureBox
            icon="map"
            title="Locate"
            description="See exactly where vendors are located and filter by distance to find what's closest to you."
          />
          <FeatureBox
            icon="star"
            title="Review"
            description="Read verified customer reviews and ratings to make informed decisions about local businesses."
          />
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: EnhancedCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative block h-64 rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={category.image || ''}
          alt={category.name}
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {category.name}
            </h3>
            <p className="text-zinc-300 text-sm">
              {category.listingCount} listings
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FeatureBoxProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  const iconMap: Record<string, JSX.Element> = {
    search: <Search size={24} />,
    map: <Map size={24} />,
    star: <Star size={24} />,
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 transition-all hover:shadow-md">
      <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/5 flex items-center justify-center text-primary mb-5 ">
        {iconMap[icon]}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
