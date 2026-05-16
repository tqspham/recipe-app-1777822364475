"use client";

import { useState } from 'react';
import BackButton from './BackButton';
import FavoriteButton from './FavoriteButton';
import EditButton from './EditButton';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';
import ServingsAdjuster from './ServingsAdjuster';
import { Recipe } from '@/lib/types';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteToggle: (isFavorite: boolean) => void;
  onBack: () => void;
  isTogglingFavorite: boolean;
  isOwner: boolean;
  onEdit: () => void;
}

export default function RecipeDetail({
  recipe,
  isFavorite,
  onFavoriteToggle,
  onBack,
  isTogglingFavorite,
  isOwner,
  onEdit,
}: RecipeDetailProps) {
  const [currentServings, setCurrentServings] = useState(recipe.servings);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="max-w-4xl">
      {/* Header with back button and actions */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <BackButton onClick={onBack} />
        <div className="flex gap-2">
          {isOwner && <EditButton onClick={onEdit} />}
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={() => onFavoriteToggle(!isFavorite)}
            isLoading={isTogglingFavorite}
          />
        </div>
      </div>

      {/* Main image */}
      <div className="mb-6 overflow-hidden rounded-[14px] bg-[#E8DDD2] shadow-md border-2" style={{ borderColor: 'var(--color-border)' }}>
        {recipe.imageUrl && !imageError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            onError={handleImageError}
            className="h-96 w-full object-cover"
          />
        ) : (
          <div className="h-96 w-full bg-gradient-to-br from-[#E8DDD2] to-[#D9CCC0] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">🍽️</div>
              <p className="text-lg" style={{ color: 'var(--color-muted-text)' }}>No image available</p>
            </div>
          </div>
        )}
      </div>

      {/* Title and description */}
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-bold" style={{ color: 'var(--color-text)' }}>{recipe.name}</h1>
        <p className="text-lg" style={{ color: 'var(--color-muted-text)' }}>{recipe.description}</p>
      </div>

      {/* Meta information */}
      <div className="mb-6 grid gap-4 rounded-[12px] border-2 p-4 sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>
            <Clock size={18} />
            <span>Prep Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{recipe.prepTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>
            <Clock size={18} />
            <span>Cook Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{recipe.cookTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>
            <ChefHat size={18} />
            <span>Difficulty</span>
          </div>
          <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{recipe.difficulty}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>
            <span>Cuisine</span>
          </div>
          <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{recipe.cuisineType}</p>
        </div>
      </div>

      {/* Dietary restrictions */}
      {recipe.dietaryRestrictions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-semibold" style={{ color: 'var(--color-text)' }}>Dietary Information</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryRestrictions.map((restriction) => (
              <span key={restriction} className="rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: 'rgba(122, 155, 110, 0.15)', color: 'var(--color-success)' }}>
                {restriction}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Servings adjuster */}
      <div className="mb-6 rounded-[12px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} style={{ color: 'var(--color-muted-text)' }} />
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>Servings: {currentServings}</span>
          </div>
          <ServingsAdjuster
            currentServings={currentServings}
            originalServings={recipe.servings}
            onChange={setCurrentServings}
          />
        </div>
      </div>

      {/* Ingredients and instructions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <IngredientsSection
            ingredients={recipe.ingredients}
            currentServings={currentServings}
            originalServings={recipe.servings}
          />
        </div>

        <div className="lg:col-span-2">
          <InstructionsSection instructions={recipe.instructions} cookTime={recipe.cookTime} />
        </div>
      </div>
    </div>
  );
}
