import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: recipe, error: recipeError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (recipeError) throw recipeError;
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const [ingredientsRes, instructionsRes, dietaryRes] = await Promise.all([
      supabase
        .from('recipe_app_1777822364475_ingredients')
        .select('*')
        .eq('recipe_id', id),
      supabase
        .from('recipe_app_1777822364475_instructions')
        .select('*')
        .eq('recipe_id', id)
        .order('step_number', { ascending: true }),
      supabase
        .from('recipe_app_1777822364475_dietary_restrictions')
        .select('*')
        .eq('recipe_id', id),
    ]);

    const fullRecipe = {
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
      userId: recipe.user_id,
      ingredients: (ingredientsRes.data || []).map((ing) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      instructions: (instructionsRes.data || []).map((instr) => instr.instruction),
      dietaryRestrictions: (dietaryRes.data || []).map((dr) => dr.restriction),
      createdAt: recipe.created_at,
    };

    return NextResponse.json({ recipe: fullRecipe });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}