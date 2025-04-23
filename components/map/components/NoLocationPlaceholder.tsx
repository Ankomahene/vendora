import { MapPin } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';

export const NoLocationPlaceholder = ({
  setShowMap,
}: {
  setShowMap: (show: boolean) => void;
}) => {
  return (
    <div className="bg-muted/50 rounded-md p-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <MapPin className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-md font-medium">Location Settings</h3>

      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Select your business location on the map to help customers find you
      </p>
      <Button onClick={() => setShowMap(true)}>Select Location</Button>
    </div>
  );
};
