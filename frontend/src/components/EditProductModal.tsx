import React, { useState, useEffect } from 'react';
import { Product, ScraperType, scraperTypeMap } from '../types';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-primary border border-border rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-secondary border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-muted mb-1">
                Product ID (SKU)
              </label>
              <input
                type="text"
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-muted mb-1">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label htmlFor="scraperType" className="block text-sm font-medium text-muted mb-1">
                Scraper Type
              </label>
              <select
                id="scraperType"
                name="scraperType"
                value={formData.scraperType}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                {Object.entries(scraperTypeMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-muted mb-1">
                Category (Danh mục)
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., Robot hút bụi"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-muted mb-1">
                Brand (Hãng)
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., Roborock"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="url" className="block text-sm font-medium text-muted mb-1">
                Product URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <button
              type="submit"
              className="flex-1 bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
