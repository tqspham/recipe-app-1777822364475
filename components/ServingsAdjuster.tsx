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
        className="rounded-[8px] border-2 p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: currentServings <= 1 ? 'var(--color-muted-text)' : 'var(--color-text)',
        }}
        aria-label="Decrease servings"
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={currentServings}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 rounded-[8px] border-2 px-2 py-2 text-center transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
        min="1"
      />

      <button
        onClick={handleIncrease}
        className="rounded-[8px] border-2 p-2 transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-background)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label="Increase servings"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
