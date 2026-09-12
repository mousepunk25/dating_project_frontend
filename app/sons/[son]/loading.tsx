// app/sons/[son]/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900 py-8 md:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Responsive Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Enlarged Portrait Photo & Buttons */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            
            {/* Image Skeleton - Matches 3:4 mobile & 4:5 desktop ratio */}
            <div className="w-full aspect-[3/4] sm:aspect-[4/5] min-h-[380px] max-h-[650px] bg-gray-200 rounded-xl" />

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
              <div className="h-12 w-full bg-gray-200 rounded-xl" />
              <div className="h-12 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Profile Information Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              {/* Full Name Skeleton */}
              <div className="h-9 sm:h-10 bg-gray-300 rounded-lg w-3/4" />
              
              {/* Age & Location Subtitle Skeleton */}
              <div className="h-5 bg-gray-200 rounded-md w-1/2" />
              
              {/* Social Media Links Divider & Pill Skeletons */}
              <div className="pt-2 border-t border-gray-100 flex gap-4">
                <div className="h-5 bg-gray-200 rounded-md w-28" />
                <div className="h-5 bg-gray-200 rounded-md w-28" />
              </div>
            </div>

            {/* About Me Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="h-6 bg-gray-300 rounded-md w-24 border-b border-gray-100 pb-3" />
              <div className="space-y-2 pt-1">
                <div className="h-4 bg-gray-200 rounded-md w-full" />
                <div className="h-4 bg-gray-200 rounded-md w-11/12" />
                <div className="h-4 bg-gray-200 rounded-md w-4/5" />
              </div>
            </div>

            {/* Professional & Education Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="h-6 bg-gray-300 rounded-md w-28 border-b border-gray-100 pb-3" />
              
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-4">
                  <div className="h-5 bg-gray-300 rounded-md w-20" />
                  <div className="h-5 bg-gray-200 rounded-md w-1/2" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-5 bg-gray-300 rounded-md w-28" />
                  <div className="h-5 bg-gray-200 rounded-md w-1/3" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}