'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { ProductType } from '@/lib/types/prouduct-type';
import { useDeleteProductType } from '@/lib/hooks/useProductTypes';
import { ProductTypeImage } from './ProductTypeImage';
import { ProductTypeForm } from './ProductTypeForm';

interface ProductTypeListProps {
  productTypes: ProductType[];
  isLoading: boolean;
}

export function ProductTypeList({
  productTypes,
  isLoading,
}: ProductTypeListProps) {
  const deleteProductType = useDeleteProductType();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product type?')) return;
    try {
      await deleteProductType.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Error in delete operation:', error);
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                Loading product types...
              </TableCell>
            </TableRow>
          ) : productTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No product types found. Create your first product type.
              </TableCell>
            </TableRow>
          ) : (
            productTypes.map((productType) => (
              <TableRow key={productType.id}>
                <TableCell className="font-medium">
                  <ProductTypeImage productType={productType} />
                </TableCell>
                <TableCell className="font-medium">
                  {productType.name}
                </TableCell>
                <TableCell>{productType.description || '-'}</TableCell>
                <TableCell>
                  {new Date(productType.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product Type</DialogTitle>
                      </DialogHeader>
                      <ProductTypeForm productType={productType} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(productType.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
