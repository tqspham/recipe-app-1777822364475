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
      className="rounded-lg border border-gray-300 bg-white p-3 text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={24}
        className={`transition-colors ${
          isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'
        }`}
      />
    </button>
  );
}