import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const includeRecipes = request.nextUrl.searchParams.get('includeRecipes') === 'true';

    const { data: favorites, error } = await supabase
      .from('recipe_app_1777822364475_favorites')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) throw error;

    const recipeIds = (favorites || []).map((f) => f.recipe_id);

    if (includeRecipes && recipeIds.length > 0) {
      const { data: recipes, error: recipeError } = await supabase
        .from('recipe_app_1777822364475_recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipeError) throw recipeError;

      const recipesWithDetails = await Promise.all(
        (recipes || []).map(async (recipe) => {
          const [ingredientsRes, instructionsRes, dietaryRes] = await Promise.all([
            supabase
              .from('recipe_app_1777822364475_ingredients')
              .select('*')
              .eq('recipe_id', recipe.id),
            supabase
              .from('recipe_app_1777822364475_instructions')
              .select('*')
              .eq('recipe_id', recipe.id)
              .order('step_number', { ascending: true }),
            supabase
              .from('recipe_app_1777822364475_dietary_restrictions')
              .select('*')
              .eq('recipe_id', recipe.id),
          ]);

          return {
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
        })
      );

      return NextResponse.json({ favorites: recipesWithDetails });
    }

    return NextResponse.json({ favorites: recipeIds });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });
    }

    const { error } = await supabase.from('recipe_app_1777822364475_favorites').insert([
      {
        user_id: userId,
        recipe_id: recipeId,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('recipe_app_1777822364475_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}