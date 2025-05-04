import { Slider } from '@/components/ui/slider';
import React from 'react';
import { useSearchContext } from '../SearchContext';
import { CURRENCY } from '@/lib/constants';

export const PriceRangeSlider = () => {
  const {
    searchState: { priceRange, searchType },
    setQuery,
  } = useSearchContext();

  if (searchType !== 'listings') return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
        Price Range
      </h3>
      <Slider
        value={priceRange}
        onValueChange={(value) => setQuery('priceRange', value)}
        max={1000}
        min={0}
        step={1}
        className="mb-2"
        aria-label="Price Range"
      />
      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          {CURRENCY} {priceRange?.[0] || 0}
        </span>
        {priceRange?.[1] && (
          <span>
            {CURRENCY} {priceRange?.[1] || 1000}
            {priceRange?.[1] >= 1000 ? '+' : ''}
          </span>
        )}
      </div>
    </div>
  );
};
