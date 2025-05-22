import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductTagsProps {
  tags: string[];
  className?: string;
  showLabel?: boolean;
  limit?: number;
}

export function ProductTags({
  tags,
  className = '',
  showLabel = false,
  limit,
}: ProductTagsProps) {
  if (!tags || tags.length === 0) return null;

  const displayTags = limit ? tags.slice(0, limit) : tags;
  const hasMore = limit && tags.length > limit;

  return (
    <div className={className}>
      {showLabel && <span className="text-sm font-medium mr-2">Tags:</span>}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center px-3 py-1"
          >
            <Tag className="h-3 w-3 mr-1" />
            <span>{tag}</span>
          </Badge>
        ))}
        {hasMore && (
          <Badge variant="outline" className="px-3 py-1">
            +{tags.length - limit} more
          </Badge>
        )}
      </div>
    </div>
  );
}
