'use client';

import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetDirections } from '@/lib/hooks';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

interface LocationWithDirectionsProps {
  location: LocationData;
  className?: string;
  label?: string;
}

export function LocationWithDirections({
  location,
  className = '',
  label,
}: LocationWithDirectionsProps) {
  const { getDirections } = useGetDirections();

  if (!location) return null;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {label && (
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {label}
              </p>
            )}
            <h3 className="font-medium text-sm">{location.name}</h3>
            <p className="text-sm text-muted-foreground">{location.address}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => getDirections(location)}
            title="Get directions"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
