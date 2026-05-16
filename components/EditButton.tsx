"use client";

import { Edit } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

export default function EditButton({ onClick, isDisabled = false }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="flex items-center gap-2 rounded-[8px] border-2 px-4 py-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = 'var(--color-background)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      aria-label="Edit recipe"
    >
      <Edit size={20} />
      <span>Edit</span>
    </button>
  );
}
