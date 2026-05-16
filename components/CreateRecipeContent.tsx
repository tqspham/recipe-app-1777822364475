"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import BackButton from '@/components/BackButton';

export default function CreateRecipeContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    imageUrl: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: string;
    rating: number;
    cuisineType: string;
    mealType: string;
    dietaryRestrictions: string[];
    ingredients: Array<{ name: string; quantity: number; unit: string }>;
    instructions: string[];
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create recipe');
      }

      const result: { recipe: { id: string } } = await response.json();
      router.push(`/recipe/${result.recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
              Favorites
            </a>
            <a href="/recipe/create" className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
              Create Recipe
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <BackButton onClick={handleBack} />
        </div>

        <div className="rounded-[12px] border-2 p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Create a New Recipe</h1>

          {error && (
            <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
            </div>
          )}

          <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
