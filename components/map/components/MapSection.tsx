'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProfileServices } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DEFAULT_MAP_VIEW_STATE } from '../constants';
import { Location, MapViewState, SearchResult } from '../types';
import { LocationDetails } from './LocationDetails';
import { MapView } from './MapView';
import { NoLocationPlaceholder } from './NoLocationPlaceholder';
import { SearchBar } from './SearchBar';
import { GoogleSearchBar } from './GoogleSearchBar';
import { Map as MapIcon, MapPin } from 'lucide-react';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function MapSection() {
  const { user, updateProfile } = useProfileServices();
  const [showMap, setShowMap] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);

  // Initialize with user's location if available
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    user?.seller_details?.location || null
  );

  // Initialize view state based on user's location or default
  const [viewState, setViewState] = useState<MapViewState>(() => {
    if (user?.seller_details?.location) {
      return {
        lng: user.seller_details.location.lng,
        lat: user.seller_details.location.lat,
        zoom: 14,
      };
    }
    return DEFAULT_MAP_VIEW_STATE;
  });

  // Update view state when user data changes
  useEffect(() => {
    if (user?.seller_details?.location) {
      setSelectedLocation(user.seller_details.location);
      setViewState({
        lng: user.seller_details.location.lng,
        lat: user.seller_details.location.lat,
        zoom: 14,
      });
    }
  }, [user]);

  const handleSearchResult = (result: SearchResult) => {
    setSelectedLocation({
      name: result.name,
      lng: result.longitude,
      lat: result.latitude,
      address: result.address,
    });

    // Update view state with zoom level 14 when selecting a location
    setViewState({
      lng: result.longitude,
      lat: result.latitude,
      zoom: 14,
    });
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map first.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to save your business location.');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          seller_details: {
            ...(user.seller_details || {}),
            location: selectedLocation,
          },
        },
      });

      toast.success('Business location saved successfully!');
      setShowMap(false);
    } catch (error) {
      console.error('Error saving business location:', error);
      toast.error('Failed to save business location. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Location</CardTitle>
        <CardDescription>
          Set your business location to help customers find you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.seller_details?.location || showMap ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="col-span-4 lg:col-span-2">
              <div className="relative space-y-4">
                <Card className="p-4 shadow-md">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUseGoogleSearch(!useGoogleSearch)}
                        className="flex items-center gap-2"
                      >
                        <MapIcon className="h-4 w-4" />
                        {useGoogleSearch ? 'Using Google Maps' : 'Using Mapbox'}
                      </Button>
                    </div>
                    {useGoogleSearch ? (
                      <GoogleSearchBar onSearchResult={handleSearchResult} />
                    ) : (
                      <SearchBar onSearchResult={handleSearchResult} />
                    )}
                  </div>
                </Card>

                <div className="h-[300px] lg:h-[400px] overflow-hidden rounded-lg shadow-md relative">
                  <MapView
                    initialViewState={viewState}
                    onViewStateChange={setViewState}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 col-span-4 lg:col-span-1">
              {selectedLocation ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LocationDetails location={selectedLocation} />

                  <div className="flex justify-end items-center gap-4 p-2">
                    <PrimaryButton
                      onClick={handleSaveLocation}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Business Location'}
                    </PrimaryButton>
                  </div>
                </motion.div>
              ) : (
                <Card className="flex h-full flex-col items-center justify-center p-6 text-center shadow-md">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <MapPin />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">
                    Select a Location
                  </h3>
                  <p className="text-muted-foreground">
                    Search for a location or click on the map to see detailed
                    information.
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <NoLocationPlaceholder setShowMap={setShowMap} />
        )}
      </CardContent>
    </Card>
  );
}
