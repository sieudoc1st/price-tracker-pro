import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
}) => {
  const itemsPerPageOptions = [10, 20, 50, 100];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-primary border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">
          Items per page:
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1); // Reset to first page when items per page changes
          }}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-md transition ${
                currentPage === page
                  ? 'bg-accent text-white font-bold'
                  : 'bg-secondary border border-border text-gray-200 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Last
        </button>
      </div>

      <div className="text-sm text-muted">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </div>
    </div>
  );
};
