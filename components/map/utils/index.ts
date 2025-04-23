/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchResult } from '../types';

export const reverseGeocode = async (
  lng: number,
  lat: number
): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );

    const data = await response.json();
    const feature = data.features[0];

    return {
      id: feature?.id || `${lng}-${lat}`,
      name: feature?.place_name || 'Selected Location',
      longitude: lng,
      latitude: lat,
      address: feature?.place_name,
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    return {
      id: `${lng}-${lat}`,
      name: 'Selected Location',
      longitude: lng,
      latitude: lat,
    };
  }
};

export const searchLocations = async (
  searchTerm: string
): Promise<SearchResult[]> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchTerm
      )}.json?access_token=${
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      }&limit=10`
    );

    const data = await response.json();

    return data.features.map((feature: any) => ({
      id: feature.id,
      name: feature.place_name,
      longitude: feature.center[0],
      latitude: feature.center[1],
      address: feature.place_name,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
