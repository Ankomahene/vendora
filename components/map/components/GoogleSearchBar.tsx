/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchBarProps } from '../types';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  GOOGLE_MAPS_FIELDS,
  GOOGLE_MAPS_SCRIPT_URL,
  GOOGLE_MAPS_TYPES,
} from '../constants';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';

export function GoogleSearchBar({
  onSearchResult,
  className,
  location,
  disabled = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(location?.name || '');
  const [predictions, setPredictions] = useState<
    Array<{ place_id: string; description: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const debouncedSearch = useDebounce(inputValue, 1000);
  const autoCompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const attributionsElement = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Handle outside clicks
  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () =>
    setShowPredictions(false)
  );

  useEffect(() => {
    // Initialize Google Places Services
    window.initGoogleAutocomplete = () => {
      if (window.google?.maps?.places) {
        autoCompleteService.current =
          new window.google.maps.places.AutocompleteService();
        if (attributionsElement.current) {
          placesService.current = new window.google.maps.places.PlacesService(
            attributionsElement.current
          );
        }
      }
    };

    // Load Google Maps JavaScript API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = GOOGLE_MAPS_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      window.initGoogleAutocomplete();
    }
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (!debouncedSearch || !autoCompleteService.current || !isUserTyping)
      return;

    setIsLoading(true);
    autoCompleteService.current.getPlacePredictions(
      {
        input: debouncedSearch,
        types: GOOGLE_MAPS_TYPES,
      },
      (predictions: any, status: string) => {
        setIsLoading(false);
        if (status === 'OK' && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  }, [debouncedSearch, isUserTyping]);

  useEffect(() => {
    setInputValue(location?.name || '');
    setIsUserTyping(false);
    setShowPredictions(false);
  }, [location]);

  const handlePredictionSelect = (prediction: {
    place_id: string;
    description: string;
  }) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: GOOGLE_MAPS_FIELDS,
      },
      (place: any, status: string) => {
        if (status === 'OK' && place?.geometry) {
          const result = {
            id: place.place_id || String(Date.now()),
            name: place.name || place.formatted_address,
            longitude: place.geometry.location.lng(),
            latitude: place.geometry.location.lat(),
            address: place.formatted_address,
          };

          onSearchResult?.(result);
          setInputValue(place.formatted_address);
          setIsUserTyping(false);
          setShowPredictions(false);
        }
      }
    );
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative flex-1">
        <Input
          placeholder="Search locations..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsUserTyping(true);
            if (e.target.value === '') {
              setPredictions([]);
              setShowPredictions(false);
              setIsUserTyping(false);
            }
          }}
          onFocus={() => {
            if (predictions.length > 0 && isUserTyping) {
              setShowPredictions(true);
            }
          }}
          className="pl-10 pr-4"
          disabled={disabled}
        />
        <MapPin
          className={cn(
            'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
            isLoading ? 'animate-spin' : '',
            'text-muted-foreground'
          )}
        />
      </div>

      {showPredictions && predictions.length > 0 && (
        <Command className="absolute z-10 mt-1 w-full rounded-md border shadow-md min-h-44 overflow-y-auto">
          <CommandGroup>
            {predictions.map((prediction) => (
              <CommandItem
                key={prediction.place_id}
                onSelect={() => handlePredictionSelect(prediction)}
                className="cursor-pointer"
              >
                {prediction.description}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      )}

      {/* Hidden element for Places Service attribution */}
      <div ref={attributionsElement} className="hidden" />
    </div>
  );
}
