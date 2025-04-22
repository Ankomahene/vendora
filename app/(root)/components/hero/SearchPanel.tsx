'use client';
import { JSX, useState } from 'react';
import { Search, MapPin, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/lib/constants';
import Link from 'next/link';

export function SearchPanel() {
  const [distance, setDistance] = useState([5]);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4 md:p-6 mt-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="What are you looking for?"
            className="pl-10 bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
          />
        </div>

        <div className="relative flex-1">
          <MapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Current location"
            className="pl-10 bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
            defaultValue="San Francisco, CA"
          />
        </div>

        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-shrink-0 space-x-1">
                <Sliders size={16} />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                  Distance
                </h4>
                <div className="space-y-2">
                  <Slider
                    defaultValue={[5]}
                    max={50}
                    step={1}
                    value={distance}
                    onValueChange={setDistance}
                    className="z-10"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>0 mi</span>
                    <span>{distance[0]} miles</span>
                    <span>50 mi</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    Rating
                  </h4>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any rating</SelectItem>
                      <SelectItem value="4plus">4+ stars</SelectItem>
                      <SelectItem value="3plus">3+ stars</SelectItem>
                      <SelectItem value="2plus">2+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    Price range
                  </h4>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any price</SelectItem>
                      <SelectItem value="low">$ (Inexpensive)</SelectItem>
                      <SelectItem value="medium">$$ (Moderate)</SelectItem>
                      <SelectItem value="high">$$$ (Expensive)</SelectItem>
                      <SelectItem value="luxury">$$$$ (Luxury)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/80">
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Link href="/search">
            <Button className="bg-primary hover:bg-primary/60">Search</Button>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary text-sm font-medium mt-4 flex items-center mx-auto md:mx-0"
      >
        {expanded ? 'Show less' : 'More categories'}
        <svg
          className={`ml-1 h-4 w-4 transform transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              name={category.name}
              icon={category.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryButtonProps {
  name: string;
  icon: string;
}

function CategoryButton({ name, icon }: CategoryButtonProps) {
  // Map category icon names to Lucide icon components
  const iconMap: Record<string, JSX.Element> = {
    utensils: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h18v18H3z M16 15H8M12 15V3"
        />
      </svg>
    ),
    'shopping-bag': (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    briefcase: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    home: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
        />
      </svg>
    ),
    car: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10"
        />
      </svg>
    ),
    'heart-pulse': (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    scissors: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
        />
      </svg>
    ),
    film: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
  };

  return (
    <button className="flex items-center justify-center flex-col bg-zinc-50 dark:bg-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-600 rounded-lg p-3 transition-colors">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
        {iconMap[icon]}
      </div>
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
    </button>
  );
}
