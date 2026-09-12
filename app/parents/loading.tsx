// loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-serif text-gray-900 dark:text-gray-100">
      {/* Max-width container matching page layout */}
      <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-pulse">
        
        {/* Search Panel Skeleton */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded-md w-48 mb-4"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800/80 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800/80 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-full md:col-span-1"></div>
          </div>
        </div>

        {/* Header Section Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded-md w-64 md:w-80"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
          </div>

          {/* Candidate Grid Skeleton (Scales from 1 to 4 columns on large desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm space-y-3 p-4"
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-800/80 rounded-lg"></div>
                
                {/* Title & Age Placeholder */}
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                
                {/* City Placeholder */}
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                
                {/* Job / Details Placeholder */}
                <div className="h-5 bg-gray-200 dark:bg-gray-800/60 rounded w-2/3 pt-2"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}