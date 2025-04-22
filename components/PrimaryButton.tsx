import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'bg-gradient-to-r from-[#4a51e5] to-[#2fd48f] hover:opacity-90 text-white cursor-pointer',
          className
        )}
        {...props}
      >
        {children || 'PrimaryButton'}
      </Button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';
