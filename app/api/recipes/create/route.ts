import { supabase } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifySessionToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const body: CreateRecipeRequest = await request.json();

    if (!body.name || !body.description || !body.ingredients.length || !body.instructions.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipeId = uuidv4();

    const { error: recipeError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .insert([
        {
          id: recipeId,
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
          user_id: user.id,
          public_visibility: true,
        },
      ]);

    if (recipeError) throw recipeError;

    if (body.ingredients.length > 0) {
      const { error: ingredientError } = await supabase
        .from('recipe_app_1777822364475_ingredients')
        .insert(
          body.ingredients.map((ing) => ({
            recipe_id: recipeId,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }))
        );

      if (ingredientError) throw ingredientError;
    }

    if (body.instructions.length > 0) {
      const { error: instructionError } = await supabase
        .from('recipe_app_1777822364475_instructions')
        .insert(
          body.instructions.map((instr, idx) => ({
            recipe_id: recipeId,
            step_number: idx + 1,
            instruction: instr,
          }))
        );

      if (instructionError) throw instructionError;
    }

    if (body.dietaryRestrictions.length > 0) {
      const { error: dietaryError } = await supabase
        .from('recipe_app_1777822364475_dietary_restrictions')
        .insert(
          body.dietaryRestrictions.map((restriction) => ({
            recipe_id: recipeId,
            restriction,
          }))
        );

      if (dietaryError) throw dietaryError;
    }

    return NextResponse.json(
      {
        recipe: {
          id: recipeId,
          name: body.name,
          description: body.description,
          imageUrl: body.imageUrl,
          prepTime: body.prepTime,
          cookTime: body.cookTime,
          servings: body.servings,
          difficulty: body.difficulty,
          rating: body.rating,
          cuisineType: body.cuisineType,
          mealType: body.mealType,
          dietaryRestrictions: body.dietaryRestrictions,
          ingredients: body.ingredients,
          instructions: body.instructions,
          userId: user.id,
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
