'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Modal for displaying image previews in fullscreen
 */
interface ImagePreviewModalProps {
  src: string;
  onClose?: () => void;
}

export const ImagePreviewModal = ({ src, onClose }: ImagePreviewModalProps) => {
  // Track loading state of the image
  const [isLoading, setIsLoading] = useState(true);

  // Pre-load the image before displaying it
  useEffect(() => {
    // Using globalThis.Image instead of just Image to ensure we access the browser's global Image constructor
    // This avoids conflicts with Next.js Image component and prevents linter errors in a client component
    const img = new globalThis.Image();
    img.onload = () => {
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return (
    // Modal backdrop with blur effect
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className="relative max-w-3xl max-h-[90vh] w-full bg-card rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        // stopPropagation prevents clicks on the modal content from bubbling up to the backdrop
        // This ensures clicking inside the modal won't trigger the onClose function, only clicking outside will
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-background rounded-full p-2 shadow-md z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Loading spinner shown while image loads */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-primary/50 border-t-primary animate-spin"></div>
          </div>
        )}

        {/* Image container */}
        <div className="flex items-center justify-center w-full h-full p-4">
          {/* Use direct img tag with the original URL (including token if present) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Preview"
            className="max-w-full max-h-[80vh] object-contain rounded-md"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
      </div>
    </div>
  );
};
