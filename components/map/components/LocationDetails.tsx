'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CornerDownRight, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Location } from '@/lib/types';

interface LocationDetailsProps {
  location: Location;
  className?: string;
}

export function LocationDetails({ location, className }: LocationDetailsProps) {
  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  };

  // Split the address into parts for nicer display
  const addressParts = location.address?.split(', ') || [];

  return (
    <Card className={cn('w-full shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold">
            {location.name || 'Selected Location'}
          </CardTitle>
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
            Location
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            Coordinates
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Longitude</div>
              <div className="font-mono font-medium">
                {formatCoordinate(location.lng)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Latitude</div>
              <div className="font-mono font-medium">
                {formatCoordinate(location.lat)}
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {addressParts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CornerDownRight className="mr-2 h-4 w-4" />
              Address Details
            </div>
            <div className="space-y-1 rounded-md bg-muted p-2 text-sm">
              {addressParts.map((part, index) => (
                <div key={index} className={index === 0 ? 'font-medium' : ''}>
                  {part}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Action buttons */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            onClick={() => window.open(getDirectionsUrl(), '_blank')}
            className="w-full"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
