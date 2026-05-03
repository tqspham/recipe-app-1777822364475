"use client";

import { Ingredient } from '@/lib/types';

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  currentServings: number;
  originalServings: number;
}

export default function IngredientsSection({
  ingredients,
  currentServings,
  originalServings,
}: IngredientsSectionProps) {
  const scaleFactor = currentServings / originalServings;

  const formatQuantity = (quantity: number): string => {
    const scaled = quantity * scaleFactor;
    // Handle fractions for common amounts
    if (Math.abs(scaled - Math.round(scaled)) < 0.01) {
      return Math.round(scaled).toString();
    }
    return scaled.toFixed(2);
  };

  return (
    <div className="rounded-[0.75rem] border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Ingredients</h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-start gap-3">
            <span className="mt-1.5 flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </span>
            <div className="flex-1">
              <p className="text-gray-900 text-sm">
                <span className="font-semibold">{formatQuantity(ingredient.quantity)}</span>
                <span className="ml-1 text-gray-600">{ingredient.unit}</span>
                <span className="ml-2 text-gray-700">{ingredient.name}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
