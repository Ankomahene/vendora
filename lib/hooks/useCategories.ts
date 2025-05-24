import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { EnhancedCategory } from '@/lib/types/category';
import { toast } from 'sonner';

type CategoryCount = {
  category_id: string;
  business_count: number;
  listing_count: number;
};

export function useCategories() {
  const supabase = createClient();

  return useQuery<EnhancedCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      // Get both categories and counts in parallel
      const [categoriesResponse, countsResponse] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.rpc('get_category_counts'),
      ]);

      if (categoriesResponse.error)
        throw new Error(categoriesResponse.error.message);
      if (countsResponse.error) throw new Error(countsResponse.error.message);

      const categories = categoriesResponse.data || [];
      const counts = (countsResponse.data as CategoryCount[]) || [];

      // Map and enhance categories with counts
      const enhancedCategories = categories.map((category) => {
        const categoryCount = counts.find(
          (count) => count.category_id === category.id
        );

        return {
          ...category,
          businessCount: categoryCount?.business_count || 0,
          listingCount: categoryCount?.listing_count || 0,
        };
      });

      // Sort categories by total activity
      return enhancedCategories.sort((a, b) => {
        // Compare total counts
        const aTotalCount = a.businessCount + a.listingCount;
        const bTotalCount = b.businessCount + b.listingCount;
        if (aTotalCount !== bTotalCount) {
          return bTotalCount - aTotalCount; // Descending order
        }

        // If total counts are equal, compare business counts
        if (a.businessCount !== b.businessCount) {
          return b.businessCount - a.businessCount;
        }

        // If business counts are equal, compare listing counts
        return b.listingCount - a.listingCount;
      });
    },
  });
}

type CategoryInput = {
  name: string;
  description: string | null;
  image: string | null;
};

type UpdateCategoryInput = CategoryInput & {
  id: string;
};

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (category: CategoryInput) => {
      const { data, error } = await supabase.from('categories').insert({
        name: category.name,
        description: category.description,
        image: category.image,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: UpdateCategoryInput) => {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          description: category.description,
          image: category.image,
        })
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    },
  });
}
