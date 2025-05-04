import { Slider } from '@/components/ui/slider';
import React from 'react';
import { useSearchContext } from '../SearchContext';
import { Button } from '@/components/ui/button';
export const DistanceSlider = () => {
  const {
    searchState: { distance },
    setQuery,
  } = useSearchContext();

  const currentDistance = distance || 0;

  const handleDecreaseDistance = () => {
    const newValue = Math.max(0, currentDistance - 1);
    setQuery('distance', newValue);
  };

  const handleIncreaseDistance = () => {
    const newValue = Math.min(100, currentDistance + 1);
    setQuery('distance', newValue);
  };

  return (
    <div>
      <div className="flex gap-1 items-center mb-2">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
          Distance
        </h3>
        {currentDistance > 0 && (
          <>
            - <span className="text-sm">{currentDistance}km</span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-1 mb-1">
        <Button
          className="p-0 w-4 h-4 rounded-xs"
          onClick={handleDecreaseDistance}
          disabled={currentDistance <= 0}
        >
          -
        </Button>
        <Slider
          value={[currentDistance]}
          onValueChange={(value) => setQuery('distance', value[0])}
          max={100}
          min={0}
          step={1}
        />

        <Button
          className="p-0 w-4 h-4 rounded-xs"
          onClick={handleIncreaseDistance}
          disabled={currentDistance >= 100}
        >
          +
        </Button>
      </div>
      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>0 km</span>
        <span>100 km</span>
      </div>
    </div>
  );
};
