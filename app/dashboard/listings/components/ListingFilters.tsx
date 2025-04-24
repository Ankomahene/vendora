'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
}

interface ListingFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ListingFilters({
  selectedCategory,
  onCategoryChange,
}: ListingFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempCategory, setTempCategory] = useState(selectedCategory);

  const supabase = createClient();

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');

        if (error) throw error;

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [supabase]);

  const applyFilters = () => {
    onCategoryChange(tempCategory);
  };

  const clearFilters = () => {
    setTempCategory('all');
    onCategoryChange('all');
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-6">
        <SheetTitle>Filter Listings</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-6">
          {/* Category filter */}
          <div>
            <h3 className="font-medium mb-4">Categories</h3>

            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <RadioGroup
                value={tempCategory}
                onValueChange={setTempCategory}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">
                    All Categories
                  </Label>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={category.id} id={category.id} />
                    <Label htmlFor={category.id} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>
      </div>

      <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
        <Button onClick={applyFilters} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </SheetFooter>
    </div>
  );
}
