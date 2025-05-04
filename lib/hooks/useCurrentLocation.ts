import { getReadableAddress } from '@/services/get-readable-address';
import { useState } from 'react';

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

interface LocationError {
  code: number;
  message: string;
}

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  const detectCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser.',
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Reverse geocoding: Convert coordinates to a human-readable address using Mapbox API
          const response = await getReadableAddress(longitude, latitude);

          const data = await response.json();
          const placeName = data.features[0]?.place_name;

          const newLocation: Location = {
            lat: latitude,
            lng: longitude,
            name: placeName || 'Your location',
            address: placeName || 'Current location',
          };

          setLocation(newLocation);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          setError({
            code: 4,
            message: error?.message || 'Failed to get location details',
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Could not determine your location';
        let errorCode = 1;

        if (error.code === 1) {
          errorMessage =
            'Location permission denied. Please enable location services.';
          errorCode = 1;
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please try again.';
          errorCode = 2;
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
          errorCode = 3;
        }

        setError({
          code: errorCode,
          message: errorMessage,
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return {
    location,
    isLoading,
    error,
    detectCurrentLocation,
  };
};
