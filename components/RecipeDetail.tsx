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
      <div className="mb-6 overflow-hidden rounded-[0.75rem] bg-gray-100 shadow-md">
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
      <div className="mb-6 grid gap-4 rounded-[0.75rem] bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Clock size={18} className="text-gray-600" />
            <span>Prep Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.prepTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Clock size={18} className="text-gray-600" />
            <span>Cook Time</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.cookTime} min</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ChefHat size={18} className="text-gray-600" />
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
              <span key={restriction} className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 font-medium">
                {restriction}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Servings adjuster */}
      <div className="mb-6 rounded-[0.75rem] border border-gray-200 bg-white p-4 shadow-sm">
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