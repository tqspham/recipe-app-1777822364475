import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

interface UpdateRecipeRequest {
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
  ingredients: Array<{ id?: string; name: string; quantity: number; unit: string }>;
  instructions: Array<{ id?: string; instruction: string; stepNumber: number }>;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const body: UpdateRecipeRequest = await request.json();

    // Verify ownership
    const { data: recipe, error: fetchError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (recipe.user_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this recipe' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!body.name || !body.description || !body.ingredients.length || !body.instructions.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update recipe
    const { error: updateError } = await supabase
      .from('recipe_app_1777822364475_recipes')
      .update({
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
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Delete and recreate ingredients
    const { error: deleteIngredientsError } = await supabase
      .from('recipe_app_1777822364475_ingredients')
      .delete()
      .eq('recipe_id', id);

    if (deleteIngredientsError) throw deleteIngredientsError;

    if (body.ingredients.length > 0) {
      const { error: ingredientError } = await supabase
        .from('recipe_app_1777822364475_ingredients')
        .insert(
          body.ingredients.map((ing) => ({
            recipe_id: id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }))
        );

      if (ingredientError) throw ingredientError;
    }

    // Delete and recreate instructions
    const { error: deleteInstructionsError } = await supabase
      .from('recipe_app_1777822364475_instructions')
      .delete()
      .eq('recipe_id', id);

    if (deleteInstructionsError) throw deleteInstructionsError;

    if (body.instructions.length > 0) {
      const { error: instructionError } = await supabase
        .from('recipe_app_1777822364475_instructions')
        .insert(
          body.instructions.map((instr, idx) => ({
            recipe_id: id,
            step_number: idx + 1,
            instruction: instr.instruction,
          }))
        );

      if (instructionError) throw instructionError;
    }

    // Delete and recreate dietary restrictions
    const { error: deleteDietaryError } = await supabase
      .from('recipe_app_1777822364475_dietary_restrictions')
      .delete()
      .eq('recipe_id', id);

    if (deleteDietaryError) throw deleteDietaryError;

    if (body.dietaryRestrictions.length > 0) {
      const { error: dietaryError } = await supabase
        .from('recipe_app_1777822364475_dietary_restrictions')
        .insert(
          body.dietaryRestrictions.map((restriction) => ({
            recipe_id: id,
            restriction,
          }))
        );

      if (dietaryError) throw dietaryError;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Recipe updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update recipe' },
      { status: 500 }
    );
  }
}