"use client";

import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-[0.5rem] border border-gray-300 bg-white px-4 py-2 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100"
      aria-label="Go back"
    >
      <ChevronLeft size={20} className="text-gray-600" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
