/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Location {
  name?: string;
  lng: number;
  lat: number;
  address?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  address?: string;
}

export interface MapViewState {
  lng: number;
  lat: number;
  zoom: number;
}

export interface MapViewProps {
  initialViewState?: MapViewState;
  onViewStateChange?: (viewState: MapViewState) => void;
  selectedLocation?: Location | null;
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export interface SearchBarProps {
  location?: Location;
  onSearchResult?: (result: SearchResult) => void;
  className?: string;
  disabled?: boolean;
}

// Google Maps Types
export interface GoogleAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => GooglePlace;
}

export interface GooglePlace {
  place_id?: string;
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface GoogleAutoCompleteService {
  getPlacePredictions: (
    request: { input: string; types: string[] },
    callback: (
      predictions: Array<{ place_id: string; description: string }> | null,
      status: any
    ) => void
  ) => void;
}

export interface GooglePlacesService {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlace | null, status: any) => void
  ) => void;
}

// Extend Window interface
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: AutocompleteOptions
          ) => GoogleAutocomplete;
          AutocompleteService: new () => GoogleAutoCompleteService;
          PlacesService: new (
            attributionNode: HTMLElement
          ) => GooglePlacesService;
        };
      };
    };
    initGoogleAutocomplete: () => void;
  }
}

export interface AutocompleteOptions {
  fields: string[];
  types: string[];
}
