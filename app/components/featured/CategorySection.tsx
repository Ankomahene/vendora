import { ArrowUpRight } from 'lucide-react';
import { trendingCategories } from '@/lib/constants';
import { JSX } from 'react';

export function CategorySection() {
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

interface Category {
  id: number;
  name: string;
  count: number;
  image: string;
}

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a
      href="#"
      className="group relative block h-64 rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
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
            <p className="text-zinc-300 text-sm">{category.count} listings</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </a>
  );
}

interface FeatureBoxProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  const iconMap: Record<string, JSX.Element> = {
    search: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    map: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    star: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
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
