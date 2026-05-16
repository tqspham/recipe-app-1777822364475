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
    if (Math.abs(scaled - Math.round(scaled)) < 0.01) {
      return Math.round(scaled).toString();
    }
    return scaled.toFixed(2);
  };

  return (
    <div className="rounded-[12px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <h2 className="mb-4 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Ingredients</h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-start gap-3">
            <span className="mt-1.5 flex-shrink-0">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </span>
            <div className="flex-1">
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                <span className="font-semibold">{formatQuantity(ingredient.quantity)}</span>
                <span className="ml-1" style={{ color: 'var(--color-muted-text)' }}>{ingredient.unit}</span>
                <span className="ml-2" style={{ color: 'var(--color-text)' }}>{ingredient.name}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
