export const getReadableAddress = async (
  lng: number,
  lat: number
): Promise<Response> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
  );

  return response;
};
