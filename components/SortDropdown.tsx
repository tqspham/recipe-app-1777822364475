"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortKey: string) => void;
}

const sortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'prepTime_asc', label: 'Prep Time (Low to High)' },
  { value: 'prepTime_desc', label: 'Prep Time (High to Low)' },
  { value: 'rating_desc', label: 'Rating (Highest First)' },
];

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || 'Sort By';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{currentLabel}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm ${
                currentSort === option.value
                  ? 'bg-blue-50 font-semibold text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}