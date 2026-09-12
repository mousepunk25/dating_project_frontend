// loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Container with maximum width constraint for big screens */}
      <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        
        {/* Header / Top Navigation Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 rounded-md w-64 md:w-80"></div>
            <div className="h-4 bg-gray-200 rounded-md w-40"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* High-Level Metrics Grid (Scales up to 4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white border border-gray-200 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Main Content Layout (Sidebar + Main Panel on Large Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Main Content / Feed Skeleton (Spans 2 cols on LG, 3 cols on XL) */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            {/* Primary Graph / Dashboard Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-8 bg-gray-200 rounded-md w-24"></div>
              </div>
              <div className="h-72 lg:h-96 bg-gray-100 rounded-lg w-full"></div>
            </div>

            {/* Sub-content list */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <div className="h-5 bg-gray-300 rounded w-36"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Sidebar Widget Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <div className="h-5 bg-gray-300 rounded w-32"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}