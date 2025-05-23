import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductTypes } from '@/lib/hooks';
import React from 'react';

export const ProductTypeSelect = ({
  productType,
  setProductType,
  searchType,
}: {
  productType: string;
  setProductType: (productType: string) => void;
  searchType: string;
}) => {
  const { data: productTypes, isLoading } = useProductTypes();

  if (searchType !== 'listings') return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Product Type
      </h3>
      <Select
        value={productType}
        onValueChange={(value) => setProductType(value)}
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
