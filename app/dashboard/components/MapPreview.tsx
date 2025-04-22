'use client';

import { useRef, useEffect, useState } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Use a sample implementation that would be replaced with Mapbox in production
export function MapPreview({
  location = { lat: 40.7128, lng: -74.006, address: 'New York, NY 10001' },
  isInteractive = false,
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulated map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // In a real implementation, this would initialize the Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || !mapLoaded) return;

    // This would be replaced with actual Mapbox initialization
    const mapContainer = mapContainerRef.current;

    // Draw a styled div to represent the map
    mapContainer.innerHTML = '';
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';
    mapContainer.style.borderRadius = '0.5rem';

    // Create a gradient background to simulate a map
    const background = document.createElement('div');
    background.style.position = 'absolute';
    background.style.top = '0';
    background.style.left = '0';
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.background =
      'linear-gradient(to right, #e6e9f0 0%, #d8e2f3 100%)';
    mapContainer.appendChild(background);

    // Add grid lines to simulate map grid
    const grid = document.createElement('div');
    grid.style.position = 'absolute';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.width = '100%';
    grid.style.height = '100%';
    grid.style.backgroundImage =
      'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)';
    grid.style.backgroundSize = '20px 20px';
    mapContainer.appendChild(grid);

    // Add a marker at the center
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.top = '50%';
    marker.style.left = '50%';
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.width = '32px';
    marker.style.height = '32px';
    marker.style.borderRadius = '50% 50% 50% 0';
    marker.style.background = '#4a51e5';
    marker.style.transform = 'translate(-50%, -100%) rotate(-45deg)';
    marker.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

    // Add a small dot inside the marker
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.top = '50%';
    dot.style.left = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.background = 'white';
    dot.style.borderRadius = '50%';
    marker.appendChild(dot);

    mapContainer.appendChild(marker);

    // Add circular pulse effect
    const pulse = document.createElement('div');
    pulse.style.position = 'absolute';
    pulse.style.top = '50%';
    pulse.style.left = '50%';
    pulse.style.width = '80px';
    pulse.style.height = '80px';
    pulse.style.borderRadius = '50%';
    pulse.style.background = 'rgba(74, 81, 229, 0.2)';
    pulse.style.transform = 'translate(-50%, -50%)';
    pulse.style.animation = 'pulse 2s infinite';

    // Add keyframes for pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    mapContainer.appendChild(pulse);

    return () => {
      // Cleanup animation
      document.head.removeChild(style);
    };
  }, [mapLoaded]);

  const handleGetDirections = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
        '_blank'
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-medium flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-[#4a51e5]" />
          Business Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div
          ref={mapContainerRef}
          className="w-full h-[220px] bg-muted rounded-md overflow-hidden relative"
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-pulse flex flex-col items-center">
                <LocateFixed className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Loading map...
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">{location.address}</p>

          {isInteractive && (
            <Button
              onClick={handleGetDirections}
              variant="outline"
              className="w-full text-[#4a51e5] border-[#4a51e5] hover:bg-[#4a51e5]/10"
            >
              <LocateFixed className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
