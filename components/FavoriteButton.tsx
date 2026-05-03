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
      className="rounded-[0.5rem] border border-gray-300 bg-white p-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={24}
        className={`transition-colors duration-200 ${
          isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'
        }`}
      />
    </button>
  );
}
