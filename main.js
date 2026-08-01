const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// تحديد مسار حفظ قاعدة البيانات (في مجلد بيانات التطبيق)
const dataFilePath = path.join(app.getPath('userData'), 'restaurant_employees.json');

// دالة تهيئة ملف البيانات إذا لم يكن موجوداً
function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools(); // افتح هذه لفحص الأخطاء أثناء التطوير
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

// === إعدادات الـ IPC للتواصل بين الواجهة والنظام (CRUD Operations) ===

// قراءة البيانات
ipcMain.handle('get-employees', async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
});

// حفظ البيانات (إضافة/تعديل/حذف)
ipcMain.handle('save-employees', async (event, employeesData) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(employeesData, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
