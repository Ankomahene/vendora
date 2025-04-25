'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Category } from '@/lib/types/category';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/lib/hooks/useCategories';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  // Set form values when category changes (for editing)
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setImageUrl(category.image || '');
    } else {
      setName('');
      setDescription('');
      setImageUrl('');
    }
  }, [category]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (category) {
        // Update existing category
        await updateCategory.mutateAsync({
          id: category.id,
          name,
          description: description || null,
          image: imageUrl || null,
        });
      } else {
        // Create new category
        await createCategory.mutateAsync({
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
          placeholder="Category name"
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
          placeholder="Category description"
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
          placeholder="Category image URL"
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
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
