import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

interface CreateRecipeRequest {
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
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  instructions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body: CreateRecipeRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.ingredients.length || !body.instructions.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .insert([
        {
          name: body.name,
          description: body.description,
          image_url: body.imageUrl || '',
          prep_time: body.prepTime,
          cook_time: body.cookTime,
          servings: body.servings,
          difficulty: body.difficulty,
          rating: body.rating,
          cuisine_type: body.cuisineType,
          meal_type: body.mealType,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (recipeError) throw recipeError;
    if (!recipe) throw new Error('Failed to create recipe');

    // Insert ingredients
    if (body.ingredients.length > 0) {
      const { error: ingredientError } = await supabase
        .from('recipe_app_1777822364475_ingredients')
        .insert(
          body.ingredients.map((ing) => ({
            recipe_id: recipe.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }))
        );

      if (ingredientError) throw ingredientError;
    }

    // Insert instructions
    if (body.instructions.length > 0) {
      const { error: instructionError } = await supabase
        .from('recipe_app_1777822364475_instructions')
        .insert(
          body.instructions.map((instr, idx) => ({
            recipe_id: recipe.id,
            step_number: idx + 1,
            instruction: instr,
          }))
        );

      if (instructionError) throw instructionError;
    }

    // Insert dietary restrictions
    if (body.dietaryRestrictions.length > 0) {
      const { error: dietaryError } = await supabase
        .from('recipe_app_1777822364475_dietary_restrictions')
        .insert(
          body.dietaryRestrictions.map((restriction) => ({
            recipe_id: recipe.id,
            restriction,
          }))
        );

      if (dietaryError) throw dietaryError;
    }

    return NextResponse.json(
      {
        recipe: {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          imageUrl: recipe.image_url,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          rating: recipe.rating,
          cuisineType: recipe.cuisine_type,
          mealType: recipe.meal_type,
          dietaryRestrictions: body.dietaryRestrictions,
          ingredients: body.ingredients,
          instructions: body.instructions,
          createdAt: recipe.created_at,
          userId: recipe.user_id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create recipe' },
      { status: 500 }
    );
  }
}