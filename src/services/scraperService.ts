import { ScraperType, ProductData } from "../types";

// Khai báo kiểu cho API được phơi bày từ preload script
interface ExposedApi {
    getProducts: () => Promise<ProductData[]>;
    addProduct: (product: ProductData) => Promise<ProductData>;
    deleteProduct: (instanceId: string) => Promise<boolean>;
    scrapePrice: (args: { url: string, scraperType: ScraperType }) => Promise<{ price: number }>;
}

// Ép kiểu window để TypeScript nhận diện được api của chúng ta
const api = (window as any).api as ExposedApi;


// --- Product Management API Calls ---

export const getProducts = async (): Promise<ProductData[]> => {
    return api.getProducts();
};

export const addProduct = async (product: ProductData): Promise<ProductData> => {
    return api.addProduct(product);
};

export const deleteProduct = async (instanceId: string): Promise<boolean> => {
    return api.deleteProduct(instanceId);
};


// --- Price Scraping API Call ---

export const fetchProductPrice = async (url: string, scraperType: ScraperType): Promise<{ price: number }> => {
    console.log(`Sending scrape request for: ${url} with scraper: ${scraperType} via Electron IPC`);
    try {
        const result = await api.scrapePrice({ url, scraperType });
        return result;
    } catch (error) {
        console.error(`Error fetching price via Electron IPC for URL ${url}:`, error);
        // Re-throw the error để component có thể xử lý
        throw error;
    }
};

/**
 * SIMULATED WEB SCRAPER (FALLBACK)
 */
export const simulateFetchProductPrice = (url: string): number => {
    console.warn(`Backend connection failed. Using simulated price for ${url}`);
    
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        const char = url.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }

    const basePrice = (Math.abs(hash) % 2000000) + 500000;
    const fluctuation = (Math.random() - 0.5) * 100000;
    const finalPrice = Math.round((basePrice + fluctuation) / 1000) * 1000;

    return finalPrice;
};
