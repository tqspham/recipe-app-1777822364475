"use client";

import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-[8px] border-2 px-4 py-2 font-medium transition-all duration-200"
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
      aria-label="Go back"
    >
      <ChevronLeft size={20} style={{ color: 'var(--color-muted-text)' }} />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
