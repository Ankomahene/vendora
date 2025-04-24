import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
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
            <p className="text-zinc-300 text-sm">
              {category.count} listings
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </a>
  );
}