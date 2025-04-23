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
  onSearchResult?: (result: SearchResult) => void;
  className?: string;
}
