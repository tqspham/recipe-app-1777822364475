"use client";

import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export default function FavoriteButton({ isFavorite, onClick, isLoading }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="rounded-[8px] border-2 p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={24}
        className={`transition-colors duration-200 ${
          isFavorite ? 'fill-[var(--color-primary)] stroke-[var(--color-primary)]' : 'stroke-[var(--color-muted-text)]'
        }`}
      />
    </button>
  );
}
