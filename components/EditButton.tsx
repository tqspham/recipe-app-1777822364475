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
      className="flex items-center gap-2 rounded-[0.5rem] border border-gray-300 bg-white px-4 py-2 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Edit recipe"
    >
      <Edit size={20} />
      <span>Edit</span>
    </button>
  );
}