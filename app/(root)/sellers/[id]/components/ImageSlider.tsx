'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  EffectFade,
  Thumbs,
  FreeMode,
} from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  businessName: string;
}

export function ImageSlider({ images, businessName }: ImageSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Only render the slider on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback for no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 sm:h-56 md:h-64 bg-muted rounded-lg flex items-center justify-center">
        <span className="text-4xl text-muted-foreground">
          {businessName?.charAt(0) || '?'}
        </span>
      </div>
    );
  }

  // If only one image, show it without the slider
  if (images.length === 1) {
    return (
      <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
        <Image
          src={images[0]}
          alt={businessName}
          className="w-full h-full object-cover"
          fill
        />
      </div>
    );
  }

  // Return null during SSR to prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="w-full h-[calc(100vw*0.6)] sm:h-[360px] md:h-[500px] flex flex-col gap-3">
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        loop={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="h-48 sm:h-56 md:h-64 w-full rounded-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`${businessName} - Image ${index + 1}`}
              className="object-cover"
              width={1000}
              height={1000}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="h-16 sm:h-20">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-swiper h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-${index}`} className="cursor-pointer">
                <div className="h-16 sm:h-20 w-full rounded-md overflow-hidden">
                  <Image
                    src={image}
                    alt={`${businessName} thumbnail ${index + 1}`}
                    className="object-cover"
                    width={1000}
                    height={1000}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
