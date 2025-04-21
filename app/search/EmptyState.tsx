import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'sellers' | 'listings' | 'categories';
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
        <SearchX className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
        No {type} found
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
        We couldn't find any {type} matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline">Clear Filters</Button>
        <Button className="bg-orange-500 hover:bg-orange-600">
          Browse All {type}
        </Button>
      </div>
    </div>
  );
}