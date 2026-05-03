"use client";

import { Search } from 'lucide-react';

interface EmptyStateProps {
  reason: string;
}

export default function EmptyState({ reason }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[0.75rem] border border-gray-200 bg-white py-12 px-6 shadow-sm">
      <div className="mb-4 inline-flex p-3 rounded-[0.75rem] bg-gray-100">
        <Search size={48} className="text-gray-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">No Recipes Found</h2>
      <p className="text-center text-gray-600 text-sm max-w-sm">{reason}</p>
    </div>
  );
}
