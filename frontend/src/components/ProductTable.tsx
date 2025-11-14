import React, { useMemo } from 'react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onCheckPrice: (instanceId: string) => void;
  onDeleteProduct?: (instanceId: string) => void;
  onEditProduct?: (product: Product) => void;
  showActions?: boolean;
}

// Format timestamp to Vietnam timezone (GMT+7)

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Helper function to get MyStore (your store) price for a product
const getMyStorePrice = (productId: string, allProducts: Product[]): number | null => {
    const myStoreProduct = allProducts.find(
        p => p.productId === productId && p.website === 'MyStore' && p.price !== null
    );
    return myStoreProduct?.price || null;
};

// Helper function to get cheaper competitors
const getCheaperCompetitors = (productId: string, myStorePrice: number, allProducts: Product[]): Product[] => {
    return allProducts.filter(
        p => p.productId === productId && 
             p.website !== 'MyStore' && 
             p.price !== null && 
             !p.isSimulated && 
             p.price < myStorePrice
    );
};

const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const ProductTable: React.FC<ProductTableProps> = ({ products, onCheckPrice, onDeleteProduct, onEditProduct, showActions = true }) => {
    if (products.length === 0) {
        return <p className="text-center text-muted py-8">Chưa có sản phẩm nào. Hãy thêm sản phẩm để bắt đầu theo dõi.</p>
    }
    
    // Get unique products (by productId)
    const uniqueProducts = useMemo(() => {
        const seen = new Set<string>();
        return products.filter(p => {
            if (seen.has(p.productId)) return false;
            seen.add(p.productId);
            return true;
        });
    }, [products]);
    
    return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
            <thead className="bg-primary">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Tên Sản Phẩm</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Giá Mi Vietnam</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Đối Thủ</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-border">
                {uniqueProducts.map((product) => {
                    const myStorePrice = getMyStorePrice(product.productId, products);
                    const cheaperCompetitors = myStorePrice ? getCheaperCompetitors(product.productId, myStorePrice, products) : [];
                    const status = cheaperCompetitors.length > 0 ? 'SOS' : 'OK';
                    
                    return (
                        <tr key={product.productId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{product.name}</div>
                                <div className="text-sm text-muted">{product.productId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                                {formatPrice(myStorePrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                {status === 'OK' ? (
                                    <span className="text-green-400 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        OK
                                    </span>
                                ) : (
                                    <span className="text-red-400 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        SOS
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                                {cheaperCompetitors.length > 0 ? (
                                    <div className="space-y-2">
                                        {cheaperCompetitors.map((competitor, idx) => (
                                            <p key={idx} className="text-accent">
                                                <a 
                                                    href={competitor.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-300 underline flex items-center"
                                                >
                                                    {competitor.website}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M11 3a1 1 0 100 2h3.586L9.293 9.293a1 1 0 001.414 1.414L16 6.414V10a1 1 0 102 0V4a1 1 0 00-1-1h-6z" />
                                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                    </svg>
                                                </a>
                                                <span className="text-white ml-1">- {formatPrice(competitor.price)}</span>
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted italic">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-3">
                                    <button onClick={() => onCheckPrice(product.instanceId)} disabled={product.status === 'loading'} className="text-accent hover:text-blue-400 disabled:text-muted disabled:cursor-not-allowed">
                                        {product.status === 'loading' ? <LoadingSpinner /> : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.414 1.414A5.002 5.002 0 005.999 7.49l-.496.497a1 1 0 01-1.414 0l-2-2A1 1 0 012 5V3a1 1 0 011-1h1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.414-1.414A5.002 5.002 0 0014.001 12.51l.496-.497a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                    {showActions && onEditProduct && (
                                        <button onClick={() => onEditProduct(product)} className="text-blue-500 hover:text-blue-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    )}
                                    {showActions && onDeleteProduct && (
                                        <button onClick={() => onDeleteProduct(product.instanceId)} className="text-red-500 hover:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};
