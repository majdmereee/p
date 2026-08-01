const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const dataFilePath = path.join(app.getPath('userData'), 'restaurant_gamified_db.json');

// الهيكل الجديد لدعم الصناديق الفترية
const defaultDB = {
  employees: [],
  currentBox: {
    id: Date.now(),
    startDate: new Date().toISOString(),
    transactions: [],
    attendance: [],
    payments: [],
    notes: []
  },
  closedBoxes: [],
  settings: { currency: '$' }
};

function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultDB, null, 2));
  } else {
    // الترقية التلقائية لقاعدة البيانات القديمة إن وجدت
    let raw = fs.readFileSync(dataFilePath, 'utf8');
    let parsed = JSON.parse(raw);
    if(!parsed.currentBox) {
        parsed.currentBox = {
            id: Date.now(), startDate: new Date().toISOString(),
            transactions: parsed.transactions || [], attendance: parsed.attendance || [],
            payments: [], notes: []
        };
        delete parsed.transactions; delete parsed.attendance;
        if(!parsed.closedBoxes) parsed.closedBoxes = [];
        fs.writeFileSync(dataFilePath, JSON.stringify(parsed, null, 2));
    }
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1400, height: 850, minWidth: 1024, minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => { initDataFile(); createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('get-db', async () => {
  try { return JSON.parse(fs.readFileSync(dataFilePath, 'utf8')); } 
  catch (error) { return defaultDB; }
});

ipcMain.handle('save-db', async (event, dbData) => {
  try { fs.writeFileSync(dataFilePath, JSON.stringify(dbData, null, 2)); return { success: true }; } 
  catch (error) { return { success: false, error: error.message }; }
});
