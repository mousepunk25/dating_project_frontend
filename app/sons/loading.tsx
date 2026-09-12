// loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-serif text-gray-900">
      {/* Max-width container matching page layout */}
      <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-pulse">
        
        {/* Search Panel Skeleton */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="h-6 bg-gray-300 rounded-md w-48 mb-4"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
          </div>
        </div>

        {/* Candidate Results Section Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="h-8 bg-gray-300 rounded-md w-64 md:w-80"></div>
          </div>

          {/* Candidate Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3"
              >
                {/* Image Skeleton */}
                <div className="w-full h-64 bg-gray-200 rounded-xl"></div>
                
                {/* Name / Title Skeleton */}
                <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
                
                {/* Age & Location Skeleton */}
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                
                {/* Job / Details Skeleton */}
                <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}