"use client";

import { Minus, Plus } from 'lucide-react';

interface ServingsAdjusterProps {
  currentServings: number;
  originalServings: number;
  onChange: (servings: number) => void;
}

export default function ServingsAdjuster({
  currentServings,
  originalServings,
  onChange,
}: ServingsAdjusterProps) {
  const handleDecrease = () => {
    if (currentServings > 1) {
      onChange(currentServings - 1);
    }
  };

  const handleIncrease = () => {
    onChange(currentServings + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrease}
        disabled={currentServings <= 1}
        className="rounded-[0.5rem] border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Decrease servings"
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={currentServings}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 rounded-[0.5rem] border border-gray-200 bg-white px-2 py-2 text-center text-gray-900 transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        min="1"
      />

      <button
        onClick={handleIncrease}
        className="rounded-[0.5rem] border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100"
        aria-label="Increase servings"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
