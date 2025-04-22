export function MapPreview() {
  return (
    <div className="w-full h-[400px] relative">
      {/* This would be replaced with a real map component in production */}
      <div className="absolute inset-0 bg-[#E8ECF0] dark:bg-zinc-700">
        {/* Map grid lines */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Roads */}
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 L1000,200"
            stroke="#CBD5E1"
            strokeWidth="10"
            opacity="0.6"
          />
          <path
            d="M0,120 L1000,120"
            stroke="#CBD5E1"
            strokeWidth="6"
            opacity="0.5"
          />
          <path
            d="M0,300 L1000,300"
            stroke="#CBD5E1"
            strokeWidth="6"
            opacity="0.5"
          />
          <path
            d="M200,0 L200,500"
            stroke="#CBD5E1"
            strokeWidth="8"
            opacity="0.6"
          />
          <path
            d="M350,0 L350,500"
            stroke="#CBD5E1"
            strokeWidth="6"
            opacity="0.5"
          />
          <path
            d="M100,0 L100,500"
            stroke="#CBD5E1"
            strokeWidth="4"
            opacity="0.5"
          />
        </svg>

        {/* Map pins */}
        <div className="absolute top-[25%] left-[30%]">
          <MapPin isPrimary />
        </div>
        <div className="absolute top-[40%] left-[45%]">
          <MapPin label="Cafe" rating={4.8} />
        </div>
        <div className="absolute top-[15%] left-[55%]">
          <MapPin label="Shop" rating={4.2} />
        </div>
        <div className="absolute top-[60%] left-[25%]">
          <MapPin label="Spa" rating={4.9} />
        </div>
        <div className="absolute top-[55%] left-[60%]">
          <MapPin label="Tech" rating={4.7} />
        </div>

        {/* Search radius visualization */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[300px] rounded-full border-2 border-primary/20 bg-primary/5"></div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="h-8 w-8 bg-white dark:bg-zinc-800 rounded shadow flex items-center justify-center">
          <svg
            className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button className="h-8 w-8 bg-white dark:bg-zinc-800 rounded shadow flex items-center justify-center">
          <svg
            className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>

      {/* Map legends/info */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 p-2 rounded shadow text-xs flex items-center space-x-2 text-zinc-600 dark:text-zinc-300">
        <div className="h-2 w-2 rounded-full bg-primary"></div>
        <span>Your location</span>
        <span className="mx-1">•</span>
        <span>5 vendors nearby</span>
      </div>
    </div>
  );
}

interface MapPinProps {
  isPrimary?: boolean;
  label?: string;
  rating?: number;
}

function MapPin({ isPrimary = false, label, rating }: MapPinProps) {
  if (isPrimary) {
    return (
      <div className="relative">
        <div className="h-6 w-6 rounded-full bg-primary border-2 border-white shadow-md"></div>
        <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full border-2 border-primary animate-ping opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-primary transform transition-transform group-hover:scale-125">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {label && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 shadow-lg rounded px-2 py-1 text-xs whitespace-nowrap">
          <div className="font-medium text-zinc-900 dark:text-white">
            {label}
          </div>
          {rating && (
            <div className="flex items-center">
              <svg
                className="h-3 w-3 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1">{rating}</span>
            </div>
          )}
          <div className="w-2 h-2 bg-white dark:bg-zinc-800 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}
