"use client";

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-12">
      <AlertCircle size={48} className="mb-4 text-red-500" />
      <h2 className="mb-2 text-xl font-semibold text-red-900">Something Went Wrong</h2>
      <p className="mb-4 text-center text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}