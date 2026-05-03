"use client";

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function SearchBar({ value, onChange, onClear, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search recipes by name or ingredient..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={isLoading}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}