"use client";

import { Heart, Clock, Star } from 'lucide-react';
import { useState } from 'react';

interface RecipeCardProps {
  id: string;
  name: string;
  imageUrl: string;
  prepTime: number;
  rating: number;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteToggle: (isFavorite: boolean) => void;
}

export default function RecipeCard({
  id,
  name,
  imageUrl,
  prepTime,
  rating,
  isFavorite,
  onClick,
  onFavoriteToggle,
}: RecipeCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFavoriteToggle(!isFavorite);
  };

  return (
    <div
      role="article"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg focus:outline-2 focus:outline-blue-500"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={`https://loremflickr.com/400/300/${name}`}
          alt={name}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-gray-100"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{name}</h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={16} />
            <span>{prepTime} min</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star size={16} className="fill-yellow-400 stroke-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}