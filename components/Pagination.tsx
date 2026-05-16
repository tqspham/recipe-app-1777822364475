"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-[8px] border-2 p-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: currentPage === 1 ? 'var(--color-muted-text)' : 'var(--color-text)',
        }}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-all duration-200 ${
              page === currentPage
                ? ''
                : typeof page === 'number'
                  ? 'border-2 cursor-pointer'
                  : 'cursor-default'
            }`}
            style={{
              backgroundColor: page === currentPage ? 'var(--color-primary)' : 'var(--color-surface)',
              borderColor: page === currentPage ? 'var(--color-primary)' : 'var(--color-border)',
              color: page === currentPage ? 'white' : (typeof page === 'number' ? 'var(--color-text)' : 'var(--color-muted-text)'),
              boxShadow: page === currentPage ? 'var(--shadow-md)' : 'none',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-[8px] border-2 p-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: currentPage === totalPages ? 'var(--color-muted-text)' : 'var(--color-text)',
        }}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
