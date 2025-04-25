'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ProductType } from '@/lib/types/prouduct-type';
import {
  useCreateProductType,
  useUpdateProductType,
} from '@/lib/hooks/useProductTypes';

interface ProductTypeFormProps {
  productType?: ProductType | null;
  onSuccess?: () => void;
}

export function ProductTypeForm({
  productType,
  onSuccess,
}: ProductTypeFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const createProductType = useCreateProductType();
  const updateProductType = useUpdateProductType();

  // Set form values when productType changes (for editing)
  useEffect(() => {
    if (productType) {
      setName(productType.name);
      setDescription(productType.description || '');
      setImageUrl(productType.image || '');
    } else {
      setName('');
      setDescription('');
      setImageUrl('');
    }
  }, [productType]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product type name is required');
      return;
    }

    try {
      if (productType) {
        // Update existing product type
        await updateProductType.mutateAsync({
          id: productType.id,
          name,
          description: description || null,
          image: imageUrl || null,
        });
      } else {
        // Create new product type
        await createProductType.mutateAsync({
          name,
          description: description || null,
          image: imageUrl || null,
        });
      }
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is already done in the mutation hooks
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product type name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product type description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL
        </label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Product type image URL"
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit">
            {productType ? 'Update Product Type' : 'Create Product Type'}
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
