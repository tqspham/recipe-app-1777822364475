"use client";

export default function LoadingState({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="rounded-[0.75rem] border border-gray-200 bg-white shadow-sm">
            {/* Image skeleton */}
            <div className="h-48 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-t-[0.75rem]" />

            {/* Content skeleton */}
            <div className="p-4">
              <div className="mb-3 h-5 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
