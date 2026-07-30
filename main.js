const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // الإصلاح الجذري: استخدام المسار المطلق بدلاً من المسار النسبي
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // ملاحظة: إذا أردت فتح شاشة فحص الأخطاء لمعرفة أي مشكلة مخفية، يمكنك تفعيل السطر التالي:
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
