"use client";

import RecipeCard from './RecipeCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';
import { Recipe } from '@/lib/types';

interface FavoritesListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  onRemoveFavorite: (id: string) => void;
  onRecipeClick: (id: string) => void;
}

export default function FavoritesList({
  recipes,
  isLoading,
  error,
  onRemoveFavorite,
  onRecipeClick,
}: FavoritesListProps) {
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) {
    return <LoadingState count={12} />;
  }

  if (recipes.length === 0) {
    return <EmptyState reason="You haven't saved any favorite recipes yet." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <RecipeCard
            id={recipe.id}
            name={recipe.name}
            imageUrl={recipe.imageUrl}
            prepTime={recipe.prepTime}
            rating={recipe.rating}
            isFavorite={true}
            onClick={() => onRecipeClick(recipe.id)}
            onFavoriteToggle={(isFavorite) => {
              if (!isFavorite) {
                onRemoveFavorite(recipe.id);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}