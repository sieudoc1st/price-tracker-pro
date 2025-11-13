import React from 'react';
import { Product } from '../types';

export interface FilterOptions {
  productId: string;
  category: string;
  brand: string;
}

interface FilterPanelProps {
  products: Product[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ products, filters, onFilterChange }) => {
  // Lấy danh sách các category và brand duy nhất từ products
  // Include undefined để filter các sản phẩm không có category/brand
  const categories = Array.from(new Set(
    products
      .map(p => p.category || undefined)
      .filter((cat, idx, arr) => arr.indexOf(cat) === idx) // unique values
  )).filter(Boolean) as string[];
  
  const brands = Array.from(new Set(
    products
      .map(p => p.brand || undefined)
      .filter((brand, idx, arr) => arr.indexOf(brand) === idx) // unique values
  )).filter(Boolean) as string[];

  // Check if there are products with no category or no brand
  const hasUncategorized = products.some(p => !p.category);
  const hasUnbranded = products.some(p => !p.brand);

  const handleClearFilters = () => {
    onFilterChange({
      productId: '',
      category: '',
      brand: '',
    });
  };

  const inputClasses = "w-full bg-primary border border-border rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-secondary border border-border rounded-lg shadow-xl p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="w-full">
          <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filter-productId" className="block text-sm font-medium text-muted mb-1">
                Product ID
              </label>
              <input
                type="text"
                id="filter-productId"
                value={filters.productId}
                onChange={(e) => onFilterChange({ ...filters, productId: e.target.value })}
                className={inputClasses}
                placeholder="Filter by Product ID..."
              />
            </div>

            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-muted mb-1">
                Category (Danh mục)
              </label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className={inputClasses}
              >
                <option value="">All Categories</option>
                {hasUncategorized && (
                  <option value="__uncategorized__">(No Category)</option>
                )}
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-brand" className="block text-sm font-medium text-muted mb-1">
                Brand (Hãng)
              </label>
              <select
                id="filter-brand"
                value={filters.brand}
                onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
                className={inputClasses}
              >
                <option value="">All Brands</option>
                {hasUnbranded && (
                  <option value="__unbranded__">(No Brand)</option>
                )}
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
