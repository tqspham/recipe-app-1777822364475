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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Favorites
            </a>
            <a href="/recipe/create" className="text-lg font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
              Create Recipe
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <BackButton onClick={handleBack} />
        </div>

        <div className="rounded-[0.75rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Create a New Recipe</h1>

          {error && (
            <div className="mb-6 rounded-[0.75rem] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
