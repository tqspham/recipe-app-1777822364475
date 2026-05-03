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
        className="rounded-[0.5rem] border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
            className={`px-3 py-2 text-sm font-medium rounded-[0.5rem] transition-all duration-200 ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-md'
                : typeof page === 'number'
                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100'
                  : 'cursor-default text-gray-400'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-[0.5rem] border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
