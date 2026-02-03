const { app, BrowserWindow } = require('electron');
const path = require('path');

// تجاهل أخطاء الـ SSL لو حصلت عشان ميعطلش فحص الاشتراك
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false, // نخفيها لحد ما تجهز
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  win.loadFile(path.join(__dirname, '../pages/index.html'));

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    // نفتح أدوات المطور علشان نشوف لو فيه أخطاء
    win.webContents.openDevTools();
  });
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
