declare namespace google.maps {
  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: HTMLElement);
      getDetails(
        request: PlaceDetailsRequest,
        callback: (
          result: PlaceResult | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
      };
    }

    interface AutocompletionRequest {
      input: string;
    }

    interface PlaceDetailsRequest {
      placeId: string;
      fields?: string[];
    }

    interface PlaceResult {
      name?: string;
      formatted_address?: string;
      geometry?: {
        location?: {
          lat(): number;
          lng(): number;
        };
      };
    }

    enum PlacesServiceStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
    }
  }
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: {
            new (): google.maps.places.AutocompleteService;
          };
          PlacesService: {
            new (attrContainer: HTMLElement): google.maps.places.PlacesService;
          };
          PlacesServiceStatus: {
            OK: google.maps.places.PlacesServiceStatus;
          };
          AutocompletePrediction: google.maps.places.AutocompletePrediction;
        };
      };
    };
  }
}

export {};
