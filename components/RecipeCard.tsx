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
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFavoriteToggle(!isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      role="article"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group cursor-pointer rounded-[14px] border-2 bg-[var(--color-surface)] shadow-sm transition-all duration-200 hover:shadow-[0_8px_16px_rgba(160,99,74,0.15)] hover:-translate-y-1 focus:outline-2 focus:outline-[var(--color-primary)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#E8DDD2] rounded-t-[12px]">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            onError={handleImageError}
            className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-[#E8DDD2] to-[#D9CCC0] flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>No image available</p>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute right-2 top-2 rounded-[8px] bg-[var(--color-surface)] p-2 shadow-md transition-all duration-200 hover:bg-[#F5F1ED] active:bg-[#E8DDD2]"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            className={`transition-colors duration-200 ${
              isFavorite ? 'fill-[var(--color-primary)] stroke-[var(--color-primary)]' : 'stroke-[var(--color-muted-text)]'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{name}</h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-muted-text)' }}>
            <Clock size={16} />
            <span>{prepTime} min</span>
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-muted-text)' }}>
            <Star size={16} className="fill-[var(--color-warning)] stroke-[var(--color-warning)]" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
