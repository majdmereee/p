const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater'); // استدعاء مكتبة التحديث التلقائي

const dbPath = path.join(app.getPath('userData'), 'daily_cash_db.json');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "الإدارة المالية برو",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    // فحص التحديثات بصمت في الخلفية
    // إذا لم يكن هناك إنترنت، سيتجاهل الأمر بصمت ويعمل التطبيق أوفلاين
    autoUpdater.checkForUpdatesAndNotify().catch(err => {
        console.log("يعمل التطبيق في وضع الأوفلاين أو لا توجد تحديثات.");
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ==========================================
// إدارة قاعدة البيانات (قراءة وحفظ)
// ==========================================
ipcMain.handle('get-db', () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {}
    return null; 
});

ipcMain.handle('save-db', (event, data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) { return false; }
});
