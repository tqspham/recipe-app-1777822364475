"use client";

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[0.75rem] border border-red-200 bg-red-50 py-12 px-6">
      <div className="mb-4 inline-flex p-3 rounded-[0.75rem] bg-red-100">
        <AlertCircle size={48} className="text-red-600" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-red-900">Something Went Wrong</h2>
      <p className="mb-6 text-center text-red-700 text-sm max-w-sm">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-[0.5rem] bg-red-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md"
      >
        Try Again
      </button>
    </div>
  );
}
