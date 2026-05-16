"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import BackButton from '@/components/BackButton';
import { Recipe } from '@/lib/types';

export default function EditRecipeContent() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isOwner = recipe && currentUserId && recipe.userId === currentUserId;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        const data: { recipe: Recipe } = await response.json();
        setRecipe(data.recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setCurrentUserId(data.user.id);
          }
        }
      } catch (err) {
        // Silent fail
      }
    };

    if (id) {
      fetchRecipe();
      fetchCurrentUser();
    }
  }, [id]);

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
    setSubmitError(null);

    try {
      const response = await fetch(`/api/recipes/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          instructions: formData.instructions.map((instr, idx) => ({
            instruction: instr,
            stepNumber: idx + 1,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update recipe');
      }

      router.push(`/recipe/${id}?success=true`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
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
          <p className="font-medium" style={{ color: 'var(--color-muted-text)' }}>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="rounded-[12px] border-2 p-8 text-center" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
          <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--color-danger)' }}>Error</h1>
          <p className="mb-4" style={{ color: 'var(--color-danger)' }}>{error || 'Recipe not found'}</p>
          <button
            onClick={handleBack}
            className="rounded-[10px] px-4 py-2 text-white font-medium transition-all duration-200"
            style={{ backgroundColor: 'var(--color-danger)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="rounded-[12px] border-2 p-8 text-center" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
          <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--color-danger)' }}>Access Denied</h1>
          <p className="mb-4" style={{ color: 'var(--color-danger)' }}>You do not have permission to edit this recipe.</p>
          <button
            onClick={handleBack}
            className="rounded-[10px] px-4 py-2 text-white font-medium transition-all duration-200"
            style={{ backgroundColor: 'var(--color-danger)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <BackButton onClick={handleBack} />
        </div>

        <div className="rounded-[12px] border-2 p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Edit Recipe</h1>

          {submitError && (
            <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{submitError}</p>
            </div>
          )}

          <RecipeForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={{
              name: recipe.name,
              description: recipe.description,
              imageUrl: recipe.imageUrl,
              prepTime: recipe.prepTime,
              cookTime: recipe.cookTime,
              servings: recipe.servings,
              difficulty: recipe.difficulty,
              rating: recipe.rating,
              cuisineType: recipe.cuisineType,
              mealType: recipe.mealType,
              dietaryRestrictions: recipe.dietaryRestrictions,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
            }}
            isEditing
          />
        </div>
      </main>
    </div>
  );
}
