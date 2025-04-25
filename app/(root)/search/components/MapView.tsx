'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function MapView() {
  return (
    <Card className="overflow-hidden h-[calc(100vh-12rem)] sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Map View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-zinc-100 dark:bg-zinc-800 h-full w-full flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              Map view will be implemented in a future update.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              This will show businesses and listings on a map.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
