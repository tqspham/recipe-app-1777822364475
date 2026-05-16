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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-muted-text)' }} />
        <input
          type="text"
          placeholder="Search recipes by name or ingredient..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full rounded-[10px] border-2 py-3 pl-10 pr-10 text-sm shadow-sm transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          disabled={isLoading}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: 'var(--color-muted-text)' }}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
