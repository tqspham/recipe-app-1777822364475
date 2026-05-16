"use client";

import { Search } from 'lucide-react';

interface EmptyStateProps {
  reason: string;
}

export default function EmptyState({ reason }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border-2 py-12 px-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="mb-4 inline-flex p-3 rounded-[10px]" style={{ backgroundColor: 'var(--color-background)' }}>
        <Search size={48} style={{ color: 'var(--color-muted-text)' }} />
      </div>
      <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>No Recipes Found</h2>
      <p className="text-center text-sm max-w-sm" style={{ color: 'var(--color-muted-text)' }}>{reason}</p>
    </div>
  );
}
