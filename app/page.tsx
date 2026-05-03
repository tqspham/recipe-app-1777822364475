import { Suspense } from 'react';
import RecipePageContent from '@/components/RecipePageContent';

export default function RecipePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>Loading...</p></div>}>
      <RecipePageContent />
    </Suspense>
  );
}
