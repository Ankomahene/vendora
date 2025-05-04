'use client';

import { MapView } from '@/components/map';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSearchContext } from '../SearchContext';

export const SearchMapModal = () => {
  const {
    searchState: { location: selectedLocation },
    setQuery,
  } = useSearchContext();

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent hover:text-black dark:hover:text-white cursor-pointer"
        >
          Select on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[550px]">
        <DialogHeader>
          <DialogTitle>Select Location on Map</DialogTitle>
          <DialogDescription>
            Click on the map to select a location.
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            'w-full rounded-md border border-input bg-background',
            'h-[400px]'
          )}
        >
          <MapView
            selectedLocation={selectedLocation}
            onLocationSelect={(location) => {
              setQuery('location', location);
              setQuery('sortBy', 'proximity');
            }}
          />
        </div>

        {selectedLocation && (
          <div className="flex items-center ">
            <p className="text-xs">
              <span className="font-bold">Selected Location:</span>{' '}
              {selectedLocation?.name}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
