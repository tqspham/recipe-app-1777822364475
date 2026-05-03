"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FavoritesList from '@/components/FavoritesList';
import UserMenu from '@/components/UserMenu';
import { Recipe } from '@/lib/types';
import { Plus } from 'lucide-react';

interface FavoritesResponse {
  favorites: Recipe[];
}

export default function FavoritesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated !== true) return;

    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/favorites?includeRecipes=true');
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data: FavoritesResponse = await response.json();
        setRecipes(data.favorites);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, router]);

  const handleRemoveFavorite = async (id: string) => {
    const previousRecipes = recipes;
    setRecipes(recipes.filter((r) => r.id !== id));

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: id }),
      });
      if (!response.ok) {
        setRecipes(previousRecipes);
      }
    } catch (err) {
      setRecipes(previousRecipes);
    }
  };

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe/${id}`);
  };

  const handleCreateRecipe = () => {
    router.push('/recipe/create');
  };

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateRecipe}
                className="flex items-center gap-2 rounded-[0.5rem] bg-blue-600 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md"
                aria-label="Create a new recipe"
              >
                <Plus size={20} />
                <span>Create Recipe</span>
              </button>
              <UserMenu />
            </div>
          </div>
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
              Favorites
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <FavoritesList
          recipes={recipes}
          isLoading={isLoading}
          error={error}
          onRemoveFavorite={handleRemoveFavorite}
          onRecipeClick={handleRecipeClick}
        />
      </main>
    </div>
  );
}
