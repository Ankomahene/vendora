import { Badge } from '@/components/ui/badge';

interface ProductTypeProps {
  type: {
    id: string;
    name: string;
  };
  className?: string;
  showLabel?: boolean;
}

export function ProductType({
  type,
  className = '',
  showLabel = false,
}: ProductTypeProps) {
  if (!type) return null;

  return (
    <div className={className}>
      {showLabel && <span className="text-sm font-medium mr-2">Type:</span>}
      <Badge variant="outline" className="px-3 py-1 text-sm">
        {type.name}
      </Badge>
    </div>
  );
}
