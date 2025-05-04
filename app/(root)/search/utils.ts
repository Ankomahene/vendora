import { SearchParams } from '@/services/search/searchService';
import { UrlSearchParams } from './types';
import { getReadableAddress } from '@/services/get-readable-address';
import { Location } from '@/lib/types';

export const getInitialParams = (
  initialUrlParams?: UrlSearchParams
): Partial<SearchParams> => {
  return {
    ...(initialUrlParams?.type ? { searchType: initialUrlParams.type } : {}),
    ...(initialUrlParams?.q ? { query: initialUrlParams.q } : {}),
    ...(initialUrlParams?.category
      ? { category: initialUrlParams.category }
      : {}),
    ...(initialUrlParams?.mode ? { serviceMode: initialUrlParams.mode } : {}),
    ...(initialUrlParams?.minPrice || initialUrlParams?.maxPrice
      ? {
          priceRange: [
            parseInt(initialUrlParams?.minPrice || '0'),
            parseInt(initialUrlParams?.maxPrice || '1000'),
          ],
        }
      : {}),
    ...(initialUrlParams?.distance
      ? { distance: parseInt(initialUrlParams.distance) }
      : {}),
    ...(initialUrlParams?.lat && initialUrlParams?.lng
      ? {
          location: {
            lat: parseFloat(initialUrlParams.lat),
            lng: parseFloat(initialUrlParams.lng),
          },
        }
      : {}),
    ...(initialUrlParams?.sort ? { sortBy: initialUrlParams.sort } : {}),
    ...(initialUrlParams?.page
      ? { page: parseInt(initialUrlParams.page) }
      : {}),
    ...(initialUrlParams?.limit
      ? { limit: parseInt(initialUrlParams.limit) }
      : {}),
  } as SearchParams;
};

export const getLocationFromCoordinates = async (
  lng: number,
  lat: number
): Promise<Location> => {
  const response = await getReadableAddress(lng, lat);
  const data = await response.json();
  const placeName = data.features[0]?.place_name;

  return {
    lat,
    lng,
    name: placeName || '',
    address: placeName || '',
  };
};
