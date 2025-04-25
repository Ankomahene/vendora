'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ProductTypeForm } from './ProductTypeForm';

export function ProductTypeHeader() {
  return (
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
            <DialogTitle>Add New Product Type</DialogTitle>
          </DialogHeader>
          <ProductTypeForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
