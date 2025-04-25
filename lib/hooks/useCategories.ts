import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/types/category';
import { toast } from 'sonner';

export function useCategories() {
  const supabase = createClient();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
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
