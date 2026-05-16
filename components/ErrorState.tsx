"use client";

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border-2 py-12 px-6" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
      <div className="mb-4 inline-flex p-3 rounded-[10px]" style={{ backgroundColor: 'rgba(184, 92, 84, 0.1)' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-danger)' }} />
      </div>
      <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--color-danger)' }}>Something Went Wrong</h2>
      <p className="mb-6 text-center text-sm max-w-sm" style={{ color: 'var(--color-danger)' }}>{message}</p>
      <button
        onClick={onRetry}
        className="rounded-[10px] px-6 py-2 font-medium text-white transition-all duration-200 shadow-sm"
        style={{
          backgroundColor: 'var(--color-danger)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#A34A42';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-danger)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        Try Again
      </button>
    </div>
  );
}
