"use client";

import { useState } from 'react';
import BackButton from './BackButton';
import FavoriteButton from './FavoriteButton';
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
}

export default function RecipeDetail({
  recipe,
  isFavorite,
  onFavoriteToggle,
  onBack,
  isTogglingFavorite,
}: RecipeDetailProps) {
  const [currentServings, setCurrentServings] = useState(recipe.servings);

  return (
    <div className="max-w-4xl">
      {/* Header with back button */}
      <div className="mb-6 flex items-start justify-between">
        <BackButton onClick={onBack} />
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => onFavoriteToggle(!isFavorite)}
          isLoading={isTogglingFavorite}
        />
      </div>

      {/* Main image */}
      <div className="mb-6 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={`https://loremflickr.com/800/400/${recipe.name}`}
          alt={recipe.name}
          className="h-96 w-full object-cover"
        />
      </div>

      {/* Title and description */}
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{recipe.name}</h1>
        <p className="text-lg text-gray-600">{recipe.description}</p>
      </div>

      {/* Meta information */}
      <div className="mb-6 grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Clock size={18} />
            <span>Prep Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.prepTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Clock size={18} />
            <span>Cook Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.cookTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ChefHat size={18} />
            <span>Difficulty</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.difficulty}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span>Cuisine</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.cuisineType}</p>
        </div>
      </div>

      {/* Dietary restrictions */}
      {recipe.dietaryRestrictions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-900">Dietary Information</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryRestrictions.map((restriction) => (
              <span key={restriction} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {restriction}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Servings adjuster */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-600" />
            <span className="font-medium text-gray-900">Servings: {currentServings}</span>
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