"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RecipeList from '@/components/RecipeList';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import { Recipe } from '@/lib/types';

interface RecipesResponse {
  recipes: Recipe[];
  totalCount: number;
  page: number;
  pageSize: number;
}

const ITEMS_PER_PAGE = 12;

export default function RecipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name_asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // Load initial state from URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cuisines = searchParams.getAll('cuisine');
    const mealTypes = searchParams.getAll('mealType');
    const dietary = searchParams.getAll('dietary');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sort = searchParams.get('sort') || 'name_asc';

    setSearchQuery(q);
    setSelectedCuisines(cuisines);
    setSelectedMealTypes(mealTypes);
    setSelectedDietary(dietary);
    setCurrentPage(page);
    setSortBy(sort);
  }, [searchParams]);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('pageSize', ITEMS_PER_PAGE.toString());

        if (searchQuery) {
          params.set('search', searchQuery);
        }

        selectedCuisines.forEach((c) => params.append('cuisine', c));
        selectedMealTypes.forEach((m) => params.append('mealType', m));
        selectedDietary.forEach((d) => params.append('dietary', d));
        params.set('sort', sortBy);

        const response = await fetch(`/api/recipes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');

        const data: RecipesResponse = await response.json();
        setRecipes(data.recipes);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred while fetching recipes'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [currentPage, searchQuery, selectedCuisines, selectedMealTypes, selectedDietary, sortBy]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoadingFavorites(true);
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data: { favorites: string[] } = await response.json();
          setFavorites(new Set(data.favorites));
        }
      } catch (err) {
        // Silent fail for favorites
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  const updateQueryParams = (
    search?: string,
    cuisines?: string[],
    mealTypes?: string[],
    dietary?: string[],
    page?: number,
    sort?: string
  ) => {
    const params = new URLSearchParams();

    if (search || searchQuery) params.set('q', search ?? searchQuery);
    (cuisines ?? selectedCuisines).forEach((c) => params.append('cuisine', c));
    (mealTypes ?? selectedMealTypes).forEach((m) => params.append('mealType', m));
    (dietary ?? selectedDietary).forEach((d) => params.append('dietary', d));
    if ((page ?? 1) > 1) params.set('page', (page ?? 1).toString());
    if (sort || sortBy !== 'name_asc') params.set('sort', sort ?? sortBy);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateQueryParams(value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setCurrentPage(1);
    updateQueryParams('');
  };

  const handleCuisineChange = (cuisines: string[]) => {
    setSelectedCuisines(cuisines);
    setCurrentPage(1);
    updateQueryParams(searchQuery, cuisines);
  };

  const handleMealTypeChange = (mealTypes: string[]) => {
    setSelectedMealTypes(mealTypes);
    setCurrentPage(1);
    updateQueryParams(searchQuery, selectedCuisines, mealTypes);
  };

  const handleDietaryChange = (dietary: string[]) => {
    setSelectedDietary(dietary);
    setCurrentPage(1);
    updateQueryParams(searchQuery, selectedCuisines, selectedMealTypes, dietary);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCuisines([]);
    setSelectedMealTypes([]);
    setSelectedDietary([]);
    setCurrentPage(1);
    setSortBy('name_asc');
    router.push('/');
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateQueryParams(searchQuery, selectedCuisines, selectedMealTypes, selectedDietary, 1, sort);
  };

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe/${id}`);
  };

  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(id);
    } else {
      newFavorites.delete(id);
    }
    setFavorites(newFavorites);

    try {
      if (isFavorite) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: id }),
        });
      } else {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: id }),
        });
      }
    } catch (err) {
      // Revert on error
      const revertedFavorites = new Set(favorites);
      if (!isFavorite) {
        revertedFavorites.add(id);
      } else {
        revertedFavorites.delete(id);
      }
      setFavorites(revertedFavorites);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams(searchQuery, selectedCuisines, selectedMealTypes, selectedDietary, page, sortBy);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Browser</h1>
          <nav className="mt-4 flex gap-4">
            <a href="/" className="text-lg font-medium text-blue-600 hover:text-blue-700">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-gray-600 hover:text-gray-900">
              Favorites
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              isLoading={isLoading}
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="flex-1">
                <FilterPanel
                  cuisines={[
                    'Italian',
                    'Mexican',
                    'Asian',
                    'Indian',
                    'Mediterranean',
                    'French',
                    'American',
                  ]}
                  mealTypes={['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']}
                  dietaryRestrictions={[
                    'Vegetarian',
                    'Vegan',
                    'Gluten-Free',
                    'Dairy-Free',
                    'Keto',
                    'Paleo',
                  ]}
                  onCuisineChange={handleCuisineChange}
                  onMealTypeChange={handleMealTypeChange}
                  onDietaryChange={handleDietaryChange}
                  onClearAll={handleClearAll}
                />
              </div>

              <div className="w-full lg:w-48">
                <SortDropdown currentSort={sortBy} onSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          <RecipeList
            recipes={recipes}
            isLoading={isLoading}
            error={error}
            onRecipeClick={handleRecipeClick}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </main>
    </div>
  );
}