const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// مسار قاعدة البيانات الشاملة
const dataFilePath = path.join(app.getPath('userData'), 'restaurant_db_pro.json');

// الهيكل الأساسي لقاعدة البيانات
const defaultDB = {
  employees: [],
  transactions: [], // السلف، الخصومات، المكافآت
  attendance: [],   // سجلات الحضور والساعات
  settings: { currency: '$', defaultShift: 'صباحي' }
};

function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultDB, null, 2));
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools(); 
}

app.whenReady().then(() => {
  initDataFile();
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// قراءة كل البيانات
ipcMain.handle('get-db', async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultDB;
  }
});

// حفظ قاعدة البيانات بالكامل
ipcMain.handle('save-db', async (event, dbData) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(dbData, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
