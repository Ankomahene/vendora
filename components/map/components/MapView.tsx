/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  ViewStateChangeEvent,
} from 'react-map-gl/mapbox';
import { cn } from '@/lib/utils';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MapViewProps } from '../types';
import {
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_VIEW_STATE,
  MARKER_ANIMATION_DURATION,
} from '../constants';
import { reverseGeocode } from '../utils';

export function MapView({
  initialViewState = DEFAULT_MAP_VIEW_STATE,
  onViewStateChange,
  selectedLocation,
  onLocationSelect,
  className,
}: MapViewProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState(initialViewState);
  const [showMarkerAnimation, setShowMarkerAnimation] = useState(false);

  // Update view state when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      setViewState({
        lng: selectedLocation.lng,
        lat: selectedLocation.lat,
        zoom: 14,
      });

      // Trigger animation
      setShowMarkerAnimation(true);
      const timer = setTimeout(
        () => setShowMarkerAnimation(false),
        MARKER_ANIMATION_DURATION
      );
      return () => clearTimeout(timer);
    }
  }, [selectedLocation]);

  const handleViewStateChange = useCallback(
    (event: ViewStateChangeEvent) => {
      const newViewState = {
        lng: event.viewState.longitude,
        lat: event.viewState.latitude,
        zoom: event.viewState.zoom,
      };
      setViewState(newViewState);
      onViewStateChange?.(newViewState);
    },
    [onViewStateChange]
  );

  const handleMapClick = async (event: {
    lngLat: { lng: number; lat: number };
  }) => {
    const { lngLat } = event;
    const locationDetails = await reverseGeocode(lngLat.lng, lngLat.lat);

    onLocationSelect?.({
      lng: locationDetails.longitude,
      lat: locationDetails.latitude,
      name: locationDetails.name,
      address: locationDetails.address,
    });
  };

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-lg',
        className
      )}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={handleViewStateChange}
        onClick={handleMapClick}
        mapStyle={DEFAULT_MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
        />

        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            anchor="bottom"
          >
            <div className="relative">
              {showMarkerAnimation && (
                <AnimatePresence>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      height: '2rem',
                      width: '2rem',
                      transform: 'translateX(-50%)',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(244, 63, 94, 0.3)',
                    }}
                  />
                </AnimatePresence>
              )}
              <MapPin className="h-8 w-8 text-rose-500 drop-shadow-md" />
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
