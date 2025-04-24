export function MapView() {
  return (
    <div className="w-full h-[calc(100vh-6rem)] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative">
      {/* This would be replaced with a real map component */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Roads */}
        <svg className="absolute inset-0" width="100%" height="100%">
          <path d="M0,200 L1000,200" stroke="#CBD5E1" strokeWidth="10" opacity="0.6" />
          <path d="M0,120 L1000,120" stroke="#CBD5E1" strokeWidth="6" opacity="0.5" />
          <path d="M0,300 L1000,300" stroke="#CBD5E1" strokeWidth="6" opacity="0.5" />
          <path d="M200,0 L200,500" stroke="#CBD5E1" strokeWidth="8" opacity="0.6" />
          <path d="M350,0 L350,500" stroke="#CBD5E1" strokeWidth="6" opacity="0.5" />
          <path d="M100,0 L100,500" stroke="#CBD5E1" strokeWidth="4" opacity="0.5" />
        </svg>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="h-8 w-8 bg-white dark:bg-zinc-700 rounded shadow flex items-center justify-center">
          <span className="text-zinc-600 dark:text-zinc-400">+</span>
        </button>
        <button className="h-8 w-8 bg-white dark:bg-zinc-700 rounded shadow flex items-center justify-center">
          <span className="text-zinc-600 dark:text-zinc-400">−</span>
        </button>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-700 p-2 rounded shadow-lg text-xs text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span>Search radius: 5 miles</span>
        
        </div>
      </div>
    </div>
  );
}