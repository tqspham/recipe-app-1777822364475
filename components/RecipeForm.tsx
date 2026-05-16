"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface RecipeFormProps {
  onSubmit: (data: {
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
  }) => Promise<void>;
  isSubmitting: boolean;
  initialValues?: {
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
  };
  isEditing?: boolean;
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const CUISINES = ['Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 'French', 'American'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'piece', 'pinch'];

export default function RecipeForm({
  onSubmit,
  isSubmitting,
  initialValues,
  isEditing = false,
}: RecipeFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState<number>(15);
  const [cookTime, setCookTime] = useState<number>(30);
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [rating, setRating] = useState<number>(5);
  const [cuisineType, setCuisineType] = useState('Italian');
  const [mealType, setMealType] = useState('Dinner');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Array<{ name: string; quantity: number; unit: string }>>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({ name: '', quantity: 1, unit: 'g' });
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setImageUrl(initialValues.imageUrl);
      setPrepTime(initialValues.prepTime);
      setCookTime(initialValues.cookTime);
      setServings(initialValues.servings);
      setDifficulty(initialValues.difficulty);
      setRating(initialValues.rating);
      setCuisineType(initialValues.cuisineType);
      setMealType(initialValues.mealType);
      setDietaryRestrictions(initialValues.dietaryRestrictions);
      setIngredients(initialValues.ingredients);
      setInstructions(initialValues.instructions);
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Recipe name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (prepTime < 1) newErrors.prepTime = 'Prep time must be at least 1 minute';
    if (cookTime < 1) newErrors.cookTime = 'Cook time must be at least 1 minute';
    if (servings < 1) newErrors.servings = 'Servings must be at least 1';
    if (ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
    if (instructions.length === 0) newErrors.instructions = 'At least one instruction is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddIngredient = () => {
    if (!currentIngredient.name.trim()) {
      setErrors({ ...errors, ingredientName: 'Ingredient name is required' });
      return;
    }
    if (currentIngredient.quantity <= 0) {
      setErrors({ ...errors, ingredientQuantity: 'Quantity must be greater than 0' });
      return;
    }

    setIngredients([...ingredients, currentIngredient]);
    setCurrentIngredient({ name: '', quantity: 1, unit: 'g' });
    setErrors({ ...errors, ingredientName: '', ingredientQuantity: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (!currentInstruction.trim()) {
      setErrors({ ...errors, instructionText: 'Instruction text is required' });
      return;
    }

    setInstructions([...instructions, currentInstruction]);
    setCurrentInstruction('');
    setErrors({ ...errors, instructionText: '' });
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const toggleDietary = (option: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      name,
      description,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      difficulty,
      rating,
      cuisineType,
      mealType,
      dietaryRestrictions,
      ingredients,
      instructions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Basic Information</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Recipe Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-muted-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
            style={{ borderColor: 'var(--color-border)' }}
            placeholder="e.g., Pasta Carbonara"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-muted-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
            style={{ borderColor: 'var(--color-border)' }}
            placeholder="Describe your recipe..."
            disabled={isSubmitting}
          />
          {errors.description && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-muted-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
            style={{ borderColor: 'var(--color-border)' }}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Timing and Servings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Timing & Servings</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Prep Time (min) *
            </label>
            <input
              id="prepTime"
              type="number"
              min="1"
              value={prepTime}
              onChange={(e) => setPrepTime(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            />
            {errors.prepTime && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.prepTime}</p>}
          </div>

          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Cook Time (min) *
            </label>
            <input
              id="cookTime"
              type="number"
              min="1"
              value={cookTime}
              onChange={(e) => setCookTime(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            />
            {errors.cookTime && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.cookTime}</p>}
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Servings *
            </label>
            <input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            />
            {errors.servings && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.servings}</p>}
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Recipe Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Difficulty *
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Rating (1-5) *
            </label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(Math.min(5, Math.max(1, parseFloat(e.target.value) || 5)))}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="cuisineType" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Cuisine Type *
            </label>
            <select
              id="cuisineType"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            >
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Meal Type *
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              disabled={isSubmitting}
            >
              {MEAL_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Dietary Information</h2>
        <div className="flex flex-wrap gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dietaryRestrictions.includes(option)}
                onChange={() => toggleDietary(option)}
                className="h-4 w-4 rounded border-2" 
                style={{ borderColor: 'var(--color-border)', accentColor: 'var(--color-primary)' }}
                disabled={isSubmitting}
              />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Ingredients *</h2>
        {errors.ingredients && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{errors.ingredients}</p>}

        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between rounded-[8px] p-3 border-2" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  <span className="font-semibold">{ingredient.quantity}</span>
                  <span className="ml-1" style={{ color: 'var(--color-muted-text)' }}>{ingredient.unit}</span>
                  <span className="ml-2" style={{ color: 'var(--color-text)' }}>{ingredient.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="rounded-[6px] p-2 transition-colors duration-200 hover:bg-[#E8DDD2]"
                style={{ color: 'var(--color-muted-text)' }}
                disabled={isSubmitting}
                aria-label={`Remove ingredient ${ingredient.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[8px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="ingredientName" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Ingredient Name
              </label>
              <input
                id="ingredientName"
                type="text"
                value={currentIngredient.name}
                onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
                className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-muted-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="e.g., Flour"
                disabled={isSubmitting}
              />
              {errors.ingredientName && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.ingredientName}</p>}
            </div>

            <div>
              <label htmlFor="ingredientQuantity" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Quantity
              </label>
              <input
                id="ingredientQuantity"
                type="number"
                min="0.1"
                step="0.1"
                value={currentIngredient.quantity}
                onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: parseFloat(e.target.value) || 1 })}
                className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
                style={{ borderColor: 'var(--color-border)' }}
                disabled={isSubmitting}
              />
              {errors.ingredientQuantity && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.ingredientQuantity}</p>}
            </div>

            <div>
              <label htmlFor="ingredientUnit" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Unit
              </label>
              <select
                id="ingredientUnit"
                value={currentIngredient.unit}
                onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
                className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
                style={{ borderColor: 'var(--color-border)' }}
                disabled={isSubmitting}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddIngredient}
            className="flex items-center justify-center gap-2 rounded-[8px] border-2 px-4 py-2 font-medium transition-all duration-200 w-full" 
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            disabled={isSubmitting}
            aria-label="Add ingredient"
          >
            <Plus size={18} />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Instructions *</h2>
        {errors.instructions && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{errors.instructions}</p>}

        <div className="space-y-3">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-start justify-between rounded-[8px] p-3 border-2 gap-3" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
              <div className="flex-1 pt-1">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <span className="font-semibold" style={{ color: 'var(--color-muted-text)' }}>Step {index + 1}:</span> {instruction}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveInstruction(index)}
                className="rounded-[6px] p-2 transition-colors duration-200 hover:bg-[#E8DDD2] flex-shrink-0"
                style={{ color: 'var(--color-muted-text)' }}
                disabled={isSubmitting}
                aria-label={`Remove instruction ${index + 1}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[8px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div>
            <label htmlFor="instruction" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Instruction Step
            </label>
            <textarea
              id="instruction"
              value={currentInstruction}
              onChange={(e) => setCurrentInstruction(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-[8px] border-2 bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] placeholder-[var(--color-muted-text)] focus:border-[var(--color-warning)] focus:ring-2 focus:ring-[rgba(196,141,79,0.1)] focus:outline-none transition-all duration-200"
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="Describe the next step..."
              disabled={isSubmitting}
            />
            {errors.instructionText && <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.instructionText}</p>}
          </div>

          <button
            type="button"
            onClick={handleAddInstruction}
            className="flex items-center justify-center gap-2 rounded-[8px] border-2 px-4 py-2 font-medium transition-all duration-200 w-full"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            disabled={isSubmitting}
            aria-label="Add instruction"
          >
            <Plus size={18} />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-[12px] px-6 py-3 text-white font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-sm"
          style={{
            backgroundColor: isSubmitting ? 'var(--color-muted-text)' : 'var(--color-primary)',
          }}
          onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = '#8B5A3F'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
          onMouseLeave={(e) => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          aria-label={isEditing ? 'Submit recipe edit form' : 'Submit recipe creation form'}
        >
          {isSubmitting ? (isEditing ? 'Updating Recipe...' : 'Creating Recipe...') : (isEditing ? 'Update Recipe' : 'Create Recipe')}
        </button>
      </div>
    </form>
  );
}
