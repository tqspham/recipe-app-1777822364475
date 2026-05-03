"use client";

import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
      aria-label="Go back"
    >
      <ChevronLeft size={20} />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}