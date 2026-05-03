"use client";

import { Search } from 'lucide-react';

interface EmptyStateProps {
  reason: string;
}

export default function EmptyState({ reason }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
      <Search size={48} className="mb-4 text-gray-400" />
      <h2 className="mb-2 text-xl font-semibold text-gray-900">No Recipes Found</h2>
      <p className="text-center text-gray-600">{reason}</p>
    </div>
  );
}