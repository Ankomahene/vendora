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
import { CategoryForm } from './CategoryForm';

export function CategoryHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Categories</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
