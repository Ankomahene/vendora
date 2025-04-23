import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { getCurrentLocation, reverseGeocode } from '../utils';
import { useMap } from 'react-map-gl/mapbox';
import { toast } from 'sonner';
import { Location } from '../types';
import { MapPin } from 'lucide-react';

interface Props {
  onLocationSelect?: (location: Location) => void;
}

export const MyLocationButton = ({ onLocationSelect }: Props) => {
  const [isLocating, setIsLocating] = useState(false);
  const { current: map } = useMap();

  const handleMyLocation = async () => {
    try {
      setIsLocating(true);
      const position = await getCurrentLocation();
      const locationDetails = await reverseGeocode(position.lng, position.lat);

      onLocationSelect?.({
        name: locationDetails.name,
        lng: locationDetails.longitude,
        lat: locationDetails.latitude,
        address: locationDetails.address,
      });
      map?.flyTo({
        center: [locationDetails.longitude, locationDetails.latitude],
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error(
        'Failed to get your current location. Please try again or search manually.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="absolute bottom-1 left-1 z-10">
      <Button
        size="sm"
        variant="secondary"
        className="bg-white/80 hover:bg-white shadow-md text-black cursor-pointer"
        onClick={handleMyLocation}
        disabled={isLocating}
      >
        <MapPin className="h-4 w-4 mr-2 text-primary" />
        {isLocating ? 'Locating...' : 'My Location'}
      </Button>
    </div>
  );
};
