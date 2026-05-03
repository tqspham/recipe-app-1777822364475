"use client";

import RecipeCard from './RecipeCard';
import Pagination from './Pagination';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { Recipe } from '@/lib/types';

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  onRecipeClick: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  favorites: Set<string>;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export default function RecipeList({
  recipes,
  isLoading,
  error,
  onRecipeClick,
  onFavoriteToggle,
  favorites,
  onPageChange,
  currentPage,
  totalPages,
}: RecipeListProps) {
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
    return <EmptyState reason="No recipes found. Try adjusting your search or filters." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="focus-within:outline-none">
            <RecipeCard
              id={recipe.id}
              name={recipe.name}
              imageUrl={recipe.imageUrl}
              prepTime={recipe.prepTime}
              rating={recipe.rating}
              isFavorite={favorites.has(recipe.id)}
              onClick={() => onRecipeClick(recipe.id)}
              onFavoriteToggle={(isFavorite) => onFavoriteToggle(recipe.id, isFavorite)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}