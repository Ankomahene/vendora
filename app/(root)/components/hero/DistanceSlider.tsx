import { Slider } from '@/components/ui/slider';
import React from 'react';
import { Button } from '@/components/ui/button';

export const DistanceSlider = ({
  distance,
  setDistance,
  disabled,
}: {
  distance: number;
  setDistance: (distance: number) => void;
  disabled?: boolean;
}) => {
  const currentDistance = distance || 0;

  const handleDecreaseDistance = () => {
    const newValue = Math.max(0, currentDistance - 1);
    setDistance(newValue);
  };

  const handleIncreaseDistance = () => {
    const newValue = Math.min(100, currentDistance + 1);
    setDistance(newValue);
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

        {disabled && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            - select location to enable
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-1 mb-1">
        <Button
          className="p-0 w-4 h-4 rounded-xs"
          onClick={handleDecreaseDistance}
          disabled={currentDistance <= 0 || disabled}
        >
          -
        </Button>
        <Slider
          value={[currentDistance]}
          onValueChange={(value) => setDistance(value[0])}
          max={100}
          min={0}
          step={1}
          disabled={disabled}
        />

        <Button
          className="p-0 w-4 h-4 rounded-xs"
          onClick={handleIncreaseDistance}
          disabled={currentDistance >= 100 || disabled}
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
