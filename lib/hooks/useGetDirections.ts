import { Location } from '../types';

type DirectionsProvider = 'google' | 'apple' | 'waze' | 'auto';

/**
 * Hook to get directions to a location
 * @returns Function to open directions in a map app
 */
export function useGetDirections() {
  /**
   * Opens directions to the specified location in a map app
   * @param location - The location coordinates and optional name/address
   * @param provider - The map provider to use (defaults to 'auto' which uses Google Maps)
   */
  const getDirections = (
    location: Location,
    provider: DirectionsProvider = 'auto'
  ) => {
    if (typeof window === 'undefined' || !location?.lat || !location?.lng) {
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const { lat, lng } = location;

    let url = '';

    // Determine which provider to use
    switch (provider) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        break;
      case 'apple':
        url = `https://maps.apple.com/?q=${lat},${lng}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        break;
      case 'auto':
      default:
        // On iOS, prefer Apple Maps, otherwise use Google Maps
        if (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          url = `https://maps.apple.com/?q=${lat},${lng}`;
        } else {
          url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        }
    }

    window.open(url, '_blank');
  };

  return { getDirections };
}
