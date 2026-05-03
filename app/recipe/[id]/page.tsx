"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import RecipeDetail from '@/components/RecipeDetail';
import EditButton from '@/components/EditButton';
import { Recipe } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isOwner = recipe && currentUserId && recipe.userId === currentUserId;

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Recipe updated successfully!');
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
        const response = await fetch('/api/user');
        if (response.ok) {
          const data: { userId: string } = await response.json();
          setCurrentUserId(data.userId);
        }
      } catch (err) {
        // Silent fail
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
      fetchCurrentUser();
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

  const handleEdit = () => {
    router.push(`/recipe/${id}/edit`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateRecipe = () => {
    router.push('/recipe/create');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-pulse rounded-[0.5rem] border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-[0.75rem] bg-red-50 p-8 text-center border border-red-200">
          <h1 className="mb-2 text-2xl font-bold text-red-900">Error</h1>
          <p className="mb-4 text-red-700">{error || 'Recipe not found'}</p>
          <button
            onClick={handleBack}
            className="rounded-[0.5rem] bg-red-600 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-red-700 active:bg-red-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-900">Recipe Details</h1>
            <button
              onClick={handleCreateRecipe}
              className="flex items-center gap-2 rounded-[0.5rem] bg-blue-600 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md"
              aria-label="Create a new recipe"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Create Recipe</span>
            </button>
          </div>
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Favorites
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {successMessage && (
          <div className="mb-6 rounded-[0.75rem] border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        )}
        <RecipeDetail
          recipe={recipe}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
          onBack={handleBack}
          isTogglingFavorite={isTogglingFavorite}
          isOwner={isOwner || false}
          onEdit={handleEdit}
        />
      </main>
    </div>
  );
}