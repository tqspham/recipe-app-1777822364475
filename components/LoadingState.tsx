"use client";

export default function LoadingState({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="rounded-[14px] border-2" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            {/* Image skeleton */}
            <div
              className="h-48 w-full animate-pulse rounded-t-[12px]"
              style={{
                background: 'linear-gradient(90deg, var(--color-background) 25%, #E8DDD2 50%, var(--color-background) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer-warm 2s infinite',
              }}
            />

            {/* Content skeleton */}
            <div className="p-4">
              <div
                className="mb-3 h-5 w-3/4 animate-pulse rounded"
                style={{
                  background: 'linear-gradient(90deg, var(--color-background) 25%, #E8DDD2 50%, var(--color-background) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer-warm 2s infinite',
                }}
              />
              <div className="space-y-2">
                <div
                  className="h-4 w-1/2 animate-pulse rounded"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-background) 25%, #E8DDD2 50%, var(--color-background) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer-warm 2s infinite',
                  }}
                />
                <div
                  className="h-4 w-1/3 animate-pulse rounded"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-background) 25%, #E8DDD2 50%, var(--color-background) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer-warm 2s infinite',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
