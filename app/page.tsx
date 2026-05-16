import { Suspense } from 'react';
import RecipePageContent from '@/components/RecipePageContent';

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center">
        <div className="mb-4 inline-block">
          <div
            className="h-12 w-12 animate-pulse rounded-[8px] border-4"
            style={{
              borderColor: 'var(--color-background)',
              borderTopColor: 'var(--color-primary)',
            }}
          />
        </div>
        <p className="font-medium" style={{ color: 'var(--color-muted-text)' }}>Loading recipes...</p>
      </div>
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RecipePageContent />
    </Suspense>
  );
}
