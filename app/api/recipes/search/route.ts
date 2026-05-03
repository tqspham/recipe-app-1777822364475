import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query || query.length < 1) {
      return NextResponse.json({
        recipes: [],
        totalCount: 0,
      });
    }

    const startTime = Date.now();

    // Search in recipe names
    const { data: recipesByName, error: nameError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .select('id')
      .ilike('name', `%${query}%`)
      .limit(100);

    if (nameError) throw nameError;

    // Search in ingredient names
    const { data: ingredientMatches, error: ingredientError } = await supabase
      .from('recipe_app_1777822364475_ingredients')
      .select('recipe_id')
      .ilike('name', `%${query}%`)
      .limit(100);

    if (ingredientError) throw ingredientError;

    // Combine unique recipe IDs
    const recipeIds = new Set<string>();
    (recipesByName || []).forEach((r) => recipeIds.add(r.id));
    (ingredientMatches || []).forEach((m) => recipeIds.add(m.recipe_id));

    const recipeIdArray = Array.from(recipeIds);

    // Fetch full recipe details
    const { data: recipes, error: fetchError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .select('*')
      .in('id', recipeIdArray);

    if (fetchError) throw fetchError;

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
            .eq('recipe_id', recipe.id),
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

    const elapsed = Date.now() - startTime;
    if (elapsed > 500) {
      // Log slow query but still return results
    }

    return NextResponse.json({
      recipes: recipesWithDetails,
      totalCount: recipesWithDetails.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}