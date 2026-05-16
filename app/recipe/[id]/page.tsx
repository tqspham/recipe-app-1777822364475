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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="sticky top-0 z-40 border-b shadow-sm" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Recipe Details</h1>
            <button
              onClick={handleCreateRecipe}
              className="flex items-center gap-2 rounded-[12px] px-4 py-2 text-white font-medium transition-all duration-200 shadow-sm"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8B5A3F';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              aria-label="Create a new recipe"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Create Recipe</span>
            </button>
          </div>
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
        {successMessage && (
          <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(122, 155, 110, 0.05)', borderColor: 'var(--color-success)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>{successMessage}</p>
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
