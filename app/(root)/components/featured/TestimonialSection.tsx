'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testimonials } from '@/lib/constants';
import Image from 'next/image';

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-white dark:bg-zinc-950 overflow-hidden"
    >
      <div className="container relative">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 dark:bg-primary/5 blur-3xl opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 dark:bg-primary/5  blur-3xl opacity-60"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            Hear from the people who have found success using Vendora for their
            business and shopping needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Cards */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 md:p-10 shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="md:w-1/4">
                          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-700 shadow-md mx-auto md:mx-0">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="md:w-3/4 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start mb-4">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="h-5 w-5 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300 text-lg italic mb-6">
                            {testimonial.comment}
                          </p>
                          <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="h-10 w-10 rounded-full"
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeIndex === index
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="h-10 w-10 rounded-full"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
