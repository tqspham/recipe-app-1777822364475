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
        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-gray-100"
        aria-label="Decrease servings"
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={currentServings}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 rounded-lg border border-gray-300 bg-white px-2 py-2 text-center text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        min="1"
      />

      <button
        onClick={handleIncrease}
        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
        aria-label="Increase servings"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}