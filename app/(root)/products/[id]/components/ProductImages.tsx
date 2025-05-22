'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  EffectFade,
  Thumbs,
  FreeMode,
  Zoom,
} from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export function ProductImages({ images, title }: ProductImagesProps) {
  const [mounted, setMounted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Only render the slider on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  // If not mounted yet (server-side), render placeholder
  if (!mounted) {
    return (
      <div className="w-full aspect-square bg-muted/20 rounded-lg animate-pulse"></div>
    );
  }

  // If only one image, show it without the slider
  if (images.length === 1) {
    return (
      <div className="w-full aspect-square relative rounded-lg overflow-hidden border">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Thumbs, Zoom]}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        zoom={{ maxRatio: 3 }}
        loop={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="w-full aspect-square rounded-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="bg-white dark:bg-zinc-900">
            <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="h-20">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-swiper h-full"
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-${index}`} className="cursor-pointer">
                <div className="h-20 w-full rounded-md overflow-hidden relative">
                  <Image
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
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
