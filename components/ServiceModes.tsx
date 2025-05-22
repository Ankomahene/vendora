import { Truck, Home, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceModesProps {
  modes: string[];
  className?: string;
  showLabel?: boolean;
}

export function ServiceModes({
  modes,
  className = '',
  showLabel = false,
}: ServiceModesProps) {
  if (!modes || modes.length === 0) return null;

  const getServiceModeIcon = (mode: string) => {
    switch (mode) {
      case 'delivery':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'home_service':
        return <Home className="h-4 w-4 mr-1" />;
      case 'in_store':
        return <ShoppingBag className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const formatModeName = (mode: string) => {
    return mode
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={className}>
      {showLabel && (
        <span className="text-sm font-medium mr-2">Service Options:</span>
      )}
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <Badge
            key={mode}
            variant="secondary"
            className="flex items-center px-3 py-1"
          >
            {getServiceModeIcon(mode)}
            <span>{formatModeName(mode)}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
