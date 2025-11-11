export type ScraperType = 'generic' | 'woocommerce' | 'cellphones' | 'dienmayxanh' | 'fptshop';

export const scraperTypeMap: Record<ScraperType, string> = {
  generic: 'Generic',
  woocommerce: 'WooCommerce',
  cellphones: 'CellphoneS',
  dienmayxanh: 'Điện máy XANH',
  fptshop: 'FPT Shop',
};

// Loại dữ liệu lưu trong DB và được truyền qua IPC
export interface ProductData {
  instanceId: string;
  productId: string;
  name: string;
  url: string;
  website: string;
  scraperType: ScraperType;
}

// Loại dữ liệu sử dụng trong state của frontend (bao gồm cả trạng thái UI)
export interface Product extends ProductData {
  price: number | null;
  lastChecked: string | null; // ISO string
  status: 'idle' | 'loading' | 'checked' | 'error';
  isSimulated?: boolean;
}
