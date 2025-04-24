/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
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
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductType {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  created_at: string;
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingProductType, setEditingProductType] =
    useState<ProductType | null>(null);

  const supabase = createClient();

  const fetchProductTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setProductTypes(data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Failed to load product types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl('');
    setEditingProductType(null);
  };

  const handleEditClick = (productType: ProductType) => {
    setEditingProductType(productType);
    setName(productType.name);
    setDescription(productType.description || '');
    setImageUrl(productType.image || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product type name is required');
      return;
    }

    try {
      if (editingProductType) {
        // Update existing product type
        const { error } = await supabase
          .from('product_types')
          .update({
            name,
            description: description || null,
            image: imageUrl || null,
          })
          .eq('id', editingProductType.id);

        if (error) throw error;
        toast.success('Product type updated successfully');
      } else {
        // Create new product type
        const { error } = await supabase.from('product_types').insert({
          name,
          description: description || null,
          image: imageUrl || null,
        });

        if (error) throw error;
        toast.success('Product type created successfully');
      }

      resetForm();
      fetchProductTypes();
    } catch (error) {
      console.error('Error saving product type:', error);
      toast.error(
        `Failed to ${editingProductType ? 'update' : 'create'} product type`
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product type?')) return;

    try {
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product type deleted successfully');
      fetchProductTypes();
    } catch (error) {
      console.error('Error deleting product type:', error);
      toast.error('Failed to delete product type');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Types</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProductType
                  ? 'Edit Product Type'
                  : 'Add New Product Type'}
              </DialogTitle>
            </DialogHeader>
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
                    {editingProductType
                      ? 'Update Product Type'
                      : 'Create Product Type'}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
            {loading ? (
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
                    {productType.image ? (
                      <div className="h-10 w-10 relative rounded-md overflow-hidden">
                        <img
                          src={productType.image}
                          alt={productType.name}
                          className="object-cover h-full w-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-muted flex items-center justify-center rounded-md">
                        <span className="text-[8px] text-muted-foreground">
                          No image
                        </span>
                      </div>
                    )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(productType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product Type</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
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
                            <label
                              htmlFor="description"
                              className="text-sm font-medium"
                            >
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
                            <label
                              htmlFor="imageUrl"
                              className="text-sm font-medium"
                            >
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
                              <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button type="submit">Update Product Type</Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
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
    </div>
  );
}
