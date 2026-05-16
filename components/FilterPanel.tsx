"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  cuisines: string[];
  mealTypes: string[];
  dietaryRestrictions: string[];
  onCuisineChange: (selected: string[]) => void;
  onMealTypeChange: (selected: string[]) => void;
  onDietaryChange: (selected: string[]) => void;
  onClearAll: () => void;
}

export default function FilterPanel({
  cuisines,
  mealTypes,
  dietaryRestrictions,
  onCuisineChange,
  onMealTypeChange,
  onDietaryChange,
  onClearAll,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [selectedMealTypes, setSelectedMealTypes] = useState<Set<string>>(new Set());
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCuisineToggle = (cuisine: string) => {
    const newSelected = new Set(selectedCuisines);
    if (newSelected.has(cuisine)) {
      newSelected.delete(cuisine);
    } else {
      newSelected.add(cuisine);
    }
    setSelectedCuisines(newSelected);
    onCuisineChange(Array.from(newSelected));
  };

  const handleMealTypeToggle = (mealType: string) => {
    const newSelected = new Set(selectedMealTypes);
    if (newSelected.has(mealType)) {
      newSelected.delete(mealType);
    } else {
      newSelected.add(mealType);
    }
    setSelectedMealTypes(newSelected);
    onMealTypeChange(Array.from(newSelected));
  };

  const handleDietaryToggle = (dietary: string) => {
    const newSelected = new Set(selectedDietary);
    if (newSelected.has(dietary)) {
      newSelected.delete(dietary);
    } else {
      newSelected.add(dietary);
    }
    setSelectedDietary(newSelected);
    onDietaryChange(Array.from(newSelected));
  };

  const handleClearAll = () => {
    setSelectedCuisines(new Set());
    setSelectedMealTypes(new Set());
    setSelectedDietary(new Set());
    onClearAll();
  };

  const hasActiveFilters =
    selectedCuisines.size > 0 || selectedMealTypes.size > 0 || selectedDietary.size > 0;

  return (
    <div className="rounded-[12px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: '#8B6F47' }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium transition-colors duration-200 hover:opacity-75"
            style={{ color: 'var(--color-primary)' }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Cuisine Type */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
          <button
            onClick={() => toggleSection('cuisine')}
            className="flex w-full items-center justify-between py-2 text-left text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--color-text)' }}
          >
            <span>Cuisine Type</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${expandedSections.has('cuisine') ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.has('cuisine') && (
            <div className="space-y-2 py-2 pl-2">
              {cuisines.map((cuisine) => (
                <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCuisines.has(cuisine)}
                    onChange={() => handleCuisineToggle(cuisine)}
                    className="h-4 w-4 rounded border-2 transition-colors duration-200"
                    style={{ borderColor: 'var(--color-border)', accentColor: 'var(--color-primary)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{cuisine}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Meal Type */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
          <button
            onClick={() => toggleSection('mealType')}
            className="flex w-full items-center justify-between py-2 text-left text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--color-text)' }}
          >
            <span>Meal Type</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${expandedSections.has('mealType') ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.has('mealType') && (
            <div className="space-y-2 py-2 pl-2">
              {mealTypes.map((mealType) => (
                <label key={mealType} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMealTypes.has(mealType)}
                    onChange={() => handleMealTypeToggle(mealType)}
                    className="h-4 w-4 rounded border-2 transition-colors duration-200"
                    style={{ borderColor: 'var(--color-border)', accentColor: 'var(--color-primary)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{mealType}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
          <button
            onClick={() => toggleSection('dietary')}
            className="flex w-full items-center justify-between py-2 text-left text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--color-text)' }}
          >
            <span>Dietary Restrictions</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${expandedSections.has('dietary') ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.has('dietary') && (
            <div className="space-y-2 py-2 pl-2">
              {dietaryRestrictions.map((dietary) => (
                <label key={dietary} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDietary.has(dietary)}
                    onChange={() => handleDietaryToggle(dietary)}
                    className="h-4 w-4 rounded border-2 transition-colors duration-200"
                    style={{ borderColor: 'var(--color-border)', accentColor: 'var(--color-primary)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{dietary}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
