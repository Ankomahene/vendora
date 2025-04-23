/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  ViewStateChangeEvent,
  FullscreenControl,
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
import { MyLocationButton } from './MyLocationButton';

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
  const isInitialMount = useRef(true);

  // Handle initial view state
  useEffect(() => {
    if (isInitialMount.current && mapRef.current) {
      mapRef.current.flyTo({
        longitude: initialViewState.lng,
        latitude: initialViewState.lat,
        zoom: initialViewState.zoom,
        duration: 0,
      });
      isInitialMount.current = false;
    }
  }, [initialViewState]);

  // Update view when selected location changes
  useEffect(() => {
    if (selectedLocation && !isInitialMount.current) {
      mapRef.current?.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 14,
        duration: 2000,
        essential: true, // This animation is considered essential for the user experience
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
        longitude={viewState.lng}
        latitude={viewState.lat}
        zoom={viewState.zoom}
        onMove={handleViewStateChange}
        onClick={handleMapClick}
        mapStyle={DEFAULT_MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          visualizePitch
          showZoom={false}
        />
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
        <FullscreenControl />
        <MyLocationButton onLocationSelect={onLocationSelect} />
      </Map>
    </div>
  );
}
