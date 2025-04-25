'use client';

import { useCategories } from '@/lib/hooks/useCategories';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { BusinessProfileFormValues } from '../types';
import { useMemo } from 'react';

interface CategorySelectProps {
  control: Control<BusinessProfileFormValues>;
}

export function CategorySelect({ control }: CategorySelectProps) {
  const { data: categories = [], isLoading } = useCategories();

  // Get the current value from the form
  const currentValue = control._formValues.business_category as string;

  // Find the selected category name for display
  const selectedCategory = useMemo(() => {
    if (!currentValue || !categories.length) return null;
    return categories.find((cat) => cat.id === currentValue);
  }, [currentValue, categories]);

  return (
    <FormField
      control={control}
      name="business_category"
      render={({ field }) => (
        <FormItem name="business_category" formItemId="business_category">
          <FormLabel>Business Category</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger
                className={isLoading ? 'opacity-70' : ''}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : selectedCategory ? (
                  selectedCategory.name
                ) : (
                  <SelectValue placeholder="Select a business category" />
                )}
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : 'No categories found'}
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
