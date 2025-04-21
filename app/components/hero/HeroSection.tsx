import { SearchPanel } from './SearchPanel';
import { MapPreview } from './MapPreview';

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-white dark:from-zinc-900 dark:to-zinc-950 -z-10" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-primary/50 dark:bg-primary/20 blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-primary/50 dark:bg-primary/20 blur-3xl opacity-50 -z-10" />

      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white leading-tight">
              Discover Local <span className="text-primary">Businesses</span>{' '}
              Near You
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0">
              Find and connect with the best local vendors, services, and
              products in your neighborhood with our intelligent location-based
              marketplace.
            </p>

            <SearchPanel />

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">
                  10,000+ Vendors
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">
                  100+ Categories
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">
                  50+ Cities
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-700">
              <MapPreview />
            </div>

            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 md:top-8 md:-left-10 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 max-w-[200px] animate-float z-20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/40 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-sm">Nearby</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                15 new businesses opened in your area this month
              </p>
            </div>

            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-10 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 max-w-[200px] animate-float-delayed z-20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-sm">Top Rated</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Discover the highest-rated services within walking distance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
