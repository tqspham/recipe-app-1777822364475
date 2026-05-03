"use client";

export default function LoadingState({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Image skeleton */}
            <div className="h-48 w-full animate-pulse bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-4">
              <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}