"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RecipeDetail from '@/components/RecipeDetail';
import { Recipe } from '@/lib/types';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

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

    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data: { favorites: string[] } = await response.json();
          setIsFavorite(data.favorites.includes(id));
        }
      } catch (err) {
        // Silent fail
      }
    };

    if (id) {
      fetchRecipe();
      fetchFavoriteStatus();
    }
  }, [id]);

  const handleFavoriteToggle = async (newIsFavorite: boolean) => {
    setIsTogglingFavorite(true);
    try {
      if (newIsFavorite) {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: id }),
        });
        if (response.ok) {
          setIsFavorite(true);
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: id }),
        });
        if (response.ok) {
          setIsFavorite(false);
        }
      }
    } catch (err) {
      // Error handled silently
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-900">Error</h1>
          <p className="mb-4 text-red-700">{error || 'Recipe not found'}</p>
          <button
            onClick={handleBack}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium text-blue-600 hover:text-blue-700">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-gray-600 hover:text-gray-900">
              Favorites
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <RecipeDetail
          recipe={recipe}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
          onBack={handleBack}
          isTogglingFavorite={isTogglingFavorite}
        />
      </main>
    </div>
  );
}