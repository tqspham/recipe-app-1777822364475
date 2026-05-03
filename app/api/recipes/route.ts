import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, parseInt(searchParams.get('pageSize') || '12', 10));
    const search = searchParams.get('search') || '';
    const cuisines = searchParams.getAll('cuisine');
    const mealTypes = searchParams.getAll('mealType');
    const dietary = searchParams.getAll('dietary');
    const sort = searchParams.get('sort') || 'name_asc';

    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('recipe_app_1777822364475_recipes')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply cuisine filter
    if (cuisines.length > 0) {
      query = query.in('cuisine_type', cuisines);
    }

    // Apply meal type filter
    if (mealTypes.length > 0) {
      query = query.in('meal_type', mealTypes);
    }

    // Apply sorting
    if (sort === 'prepTime_asc') {
      query = query.order('prep_time', { ascending: true });
    } else if (sort === 'prepTime_desc') {
      query = query.order('prep_time', { ascending: false });
    } else if (sort === 'rating_desc') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    const { data: recipes, count, error } = await query;

    if (error) throw error;

    // Fetch related data for each recipe
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

    // Apply dietary filter after fetching (since it's in a separate table)
    let filtered = recipesWithDetails;
    if (dietary.length > 0) {
      filtered = recipesWithDetails.filter((recipe) =>
        dietary.every((d) => recipe.dietaryRestrictions.includes(d))
      );
    }

    const totalCount = filtered.length;

    return NextResponse.json({
      recipes: filtered.slice(0, pageSize),
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}