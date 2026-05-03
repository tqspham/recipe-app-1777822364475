"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FavoritesList from '@/components/FavoritesList';
import { Recipe } from '@/lib/types';

interface FavoritesResponse {
  favorites: Recipe[];
}

export default function FavoritesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <nav className="mt-4 flex gap-4">
            <a href="/" className="text-lg font-medium text-gray-600 hover:text-gray-900">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-blue-600 hover:text-blue-700">
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