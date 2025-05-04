export const DEFAULT_MAP_VIEW_STATE = {
  lng: -0.195306,
  lat: 5.551983,
  zoom: 14,
};

export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

export const MARKER_ANIMATION_DURATION = 1500; // in milliseconds

export const GEOCODING_API_LIMIT = 10;

export const LOCATION_SELECTION_ZOOM = 14; // Higher zoom level when selecting a location

// Google Maps Constants
export const GOOGLE_MAPS_FIELDS = ['formatted_address', 'geometry', 'name'];
export const GOOGLE_MAPS_TYPES = ['geocode', 'establishment'];
export const GOOGLE_MAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleAutocomplete`;
