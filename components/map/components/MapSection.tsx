'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LocationDetails } from './LocationDetails';
import { MapView } from './MapView';
import { SearchBar } from './SearchBar';
import { useProfileServices } from '@/lib/hooks';
import { NoLocationPlaceholder } from './NoLocationPlaceholder';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';
import { Location, SearchResult } from '../types';
import { DEFAULT_MAP_VIEW_STATE } from '../constants';

export default function MapSection() {
  const { user, updateProfile } = useProfileServices();
  const [showMap, setShowMap] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    user?.seller_details.location || null
  );
  const [viewState, setViewState] = useState(DEFAULT_MAP_VIEW_STATE);

  const handleSearchResult = (result: SearchResult) => {
    setSelectedLocation({
      name: result.name,
      lng: result.longitude,
      lat: result.latitude,
      address: result.address,
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
        {user?.seller_details.location || showMap ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="col-span-4 lg:col-span-2">
              <div className="relative space-y-4">
                <Card className="p-4 shadow-md">
                  <SearchBar onSearchResult={handleSearchResult} />
                </Card>

                <div className="h-[300px] lg:h-[400px] overflow-hidden rounded-lg shadow-md relative">
                  <MapView
                    initialViewState={viewState}
                    onViewStateChange={setViewState}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                  />

                  <div className="absolute top-3 right-3 z-10">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/80 hover:bg-white shadow-md text-black cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      My Location
                    </Button>
                  </div>
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

                  <div className="flex items-center gap-4 py-2">
                    <Button
                      onClick={handleSaveLocation}
                      className="w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Location'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowMap(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <Card className="flex h-full flex-col items-center justify-center p-6 text-center shadow-md">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                    </svg>
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
