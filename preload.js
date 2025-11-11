const { contextBridge, ipcRenderer } = require('electron');

// Phơi bày các hàm backend một cách an toàn cho frontend (renderer process)
contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('get-products'),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  deleteProduct: (instanceId) => ipcRenderer.invoke('delete-product', instanceId),
  scrapePrice: ({ url, scraperType }) => ipcRenderer.invoke('scrape-price', { url, scraperType }),
});
