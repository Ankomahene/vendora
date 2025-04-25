import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ProductType } from '@/lib/types/prouduct-type';
import { toast } from 'sonner';

export function useProductTypes() {
  const supabase = createClient();

  return useQuery<ProductType[]>({
    queryKey: ['productTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}

type ProductTypeInput = {
  name: string;
  description: string | null;
  image: string | null;
};

type UpdateProductTypeInput = ProductTypeInput & {
  id: string;
};

export function useCreateProductType() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (productType: ProductTypeInput) => {
      const { data, error } = await supabase.from('product_types').insert({
        name: productType.name,
        description: productType.description,
        image: productType.image,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      toast.success('Product type created successfully');
    },
    onError: (error) => {
      console.error('Error creating product type:', error);
      toast.error('Failed to create product type');
    },
  });
}

export function useUpdateProductType() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...productType }: UpdateProductTypeInput) => {
      const { data, error } = await supabase
        .from('product_types')
        .update({
          name: productType.name,
          description: productType.description,
          image: productType.image,
        })
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      toast.success('Product type updated successfully');
    },
    onError: (error) => {
      console.error('Error updating product type:', error);
      toast.error('Failed to update product type');
    },
  });
}

export function useDeleteProductType() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      toast.success('Product type deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting product type:', error);
      toast.error('Failed to delete product type');
    },
  });
}
