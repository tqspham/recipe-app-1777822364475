import { Suspense } from 'react';
import RecipePageContent from '@/components/RecipePageContent';

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <div className="h-12 w-12 animate-pulse rounded-[0.5rem] border-4 border-gray-200 border-t-blue-600"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading recipes...</p>
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
