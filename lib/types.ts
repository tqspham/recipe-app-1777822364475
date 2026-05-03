export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  rating: number;
  cuisineType: string;
  mealType: string;
  dietaryRestrictions: string[];
  ingredients: Ingredient[];
  instructions: string[];
  createdAt: string;
  userId?: string;
  publicVisibility?: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}
