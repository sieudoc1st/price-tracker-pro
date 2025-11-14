import React, { useMemo } from 'react';
import { Product } from '../types';

interface ProductListTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (instanceId: string) => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({ products, onEditProduct, onDeleteProduct }) => {
    // Get unique products (by productId)
    const uniqueProducts = useMemo(() => {
        const seen = new Set<string>();
        const unique: { [key: string]: Product } = {};
        
        products.forEach(p => {
            if (!seen.has(p.productId)) {
                seen.add(p.productId);
                unique[p.productId] = p;
            }
        });
        
        return Object.values(unique);
    }, [products]);

    if (uniqueProducts.length === 0) {
        return <p className="text-center text-muted py-8">Chưa có sản phẩm nào.</p>;
    }

    return (
        <div className="mt-8 bg-secondary border border-border rounded-lg shadow-xl p-4 md:p-6">
            <h3 className="text-xl font-bold text-white mb-4">Danh Sách Sản Phẩm</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Tên Sản Phẩm</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Công Ty</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Tác Vụ</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-secondary divide-y divide-border">
                        {uniqueProducts.map((product) => (
                            <tr key={product.productId}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-white">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                    {product.productId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.website}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                        <button 
                                            onClick={() => onEditProduct(product)} 
                                            className="text-blue-500 hover:text-blue-400"
                                            title="Chỉnh sửa"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => onDeleteProduct(product.instanceId)} 
                                            className="text-red-500 hover:text-red-400"
                                            title="Xóa"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
