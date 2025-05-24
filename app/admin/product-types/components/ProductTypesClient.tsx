'use client';

import { useProductTypes } from '@/lib/hooks/useProductTypes';
import { ProductTypeHeader } from './ProductTypeHeader';
import { ProductTypeList } from './ProductTypeList';

export default function ProductTypesClient() {
  const { data: productTypes = [], isLoading } = useProductTypes();

  return (
    <div className="space-y-6">
      <ProductTypeHeader />
      <ProductTypeList productTypes={productTypes} isLoading={isLoading} />
    </div>
  );
}
