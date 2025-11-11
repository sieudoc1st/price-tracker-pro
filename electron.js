const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const axios = require('axios');
const cheerio = require('cheerio');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Đường dẫn lưu trữ database trong thư mục người dùng
const dbPath = path.join(app.getPath('userData'), 'database.db');
const db = new Database(dbPath);

// Khởi tạo bảng trong DB nếu chưa tồn tại
const createTableStmt = db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    instanceId TEXT PRIMARY KEY,
    productId TEXT,
    name TEXT,
    url TEXT,
    website TEXT,
    scraperType TEXT
  )
`);
createTableStmt.run();


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the index.html of the app.
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// --- Logic Backend (IPC Handlers) ---

// Lấy tất cả sản phẩm
ipcMain.handle('get-products', async () => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY website, name');
  return stmt.all();
});

// Thêm sản phẩm
ipcMain.handle('add-product', async (event, product) => {
  const { instanceId, productId, name, url, website, scraperType } = product;
  const stmt = db.prepare('INSERT INTO products (instanceId, productId, name, url, website, scraperType) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(instanceId, productId, name, url, website, scraperType);
  return product;
});

// Xóa sản phẩm
ipcMain.handle('delete-product', async (event, instanceId) => {
  const stmt = db.prepare('DELETE FROM products WHERE instanceId = ?');
  const info = stmt.run(instanceId);
  return info.changes > 0;
});

// Scrape giá sản phẩm
const parsePrice = (priceText) => {
  if (!priceText || typeof priceText !== 'string') return null;
  const digitsOnly = priceText.replace(/[^\d]/g, '');
  return parseInt(digitsOnly, 10);
};

ipcMain.handle('scrape-price', async (event, { url, scraperType }) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(data);
    let priceText;

    switch (scraperType) {
        case 'woocommerce':
            priceText = $('.woocommerce-Price-amount.amount').first().text();
            break;
        case 'cellphones':
            priceText = $('.sale-price').first().text();
            break;
        case 'dienmayxanh':
            priceText = $('.bs_price strong').first().text();
            break;
        case 'fptshop':
            priceText = $('.price-product').first().text() || $('.text-black-opacity-100.h4-bold').first().text();
            break;
        case 'generic':
        default:
            priceText = $('meta[property="product:price:amount"]').attr('content') || $('meta[property="og:price:amount"]').attr('content');
            break;
    }

    if (!priceText) {
      throw new Error('Price element not found on page.');
    }
    
    const price = parsePrice(priceText);

    if (price === null || isNaN(price)) {
      throw new Error('Could not parse price from page.');
    }

    return { price };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    // Gửi lỗi về cho frontend để xử lý
    throw new Error(error.message);
  }
});
