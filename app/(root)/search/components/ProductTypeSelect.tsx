import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductTypes } from '@/lib/hooks';
import React from 'react';
import { useSearchContext } from '../SearchContext';

export const ProductTypeSelect = () => {
  const {
    searchState: { productType, searchType },
    setQuery,
  } = useSearchContext();
  const { data: productTypes, isLoading } = useProductTypes();

  if (searchType !== 'listings') return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Product Type
      </h3>
      <Select
        value={productType}
        onValueChange={(value) => setQuery('productType', value)}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Product Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Product Types</SelectItem>
          {productTypes?.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
