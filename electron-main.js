const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'icon.png')
    });

    // حمل ملف الـ HTML بتاعك (غير الاسم لو مختلف)
    mainWindow.loadFile('pages/index.html');

    // افتح DevTools (اختياري - شيله لو مش عايزه)
    // mainWindow.webContents.openDevTools();

    // بعد ما الويندو تفتح، شيك على التحديثات
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // انتظر ثانيتين ثم شيك على التحديثات
        setTimeout(() => {
            autoUpdater.checkForUpdatesAndNotify();
        }, 2000);
    });
}

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

// ===== أحداث التحديث التلقائي =====

autoUpdater.on('checking-for-update', () => {
    console.log('🔍 جاري البحث عن تحديثات...');
});

autoUpdater.on('update-available', (info) => {
    console.log('✅ يوجد تحديث جديد!');
    if (mainWindow) {
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'تحديث متاح',
            message: 'يوجد نسخة جديدة من التطبيق. سيتم تحميلها الآن.',
            buttons: ['حسناً']
        });
    }
});

autoUpdater.on('update-not-available', () => {
    console.log('✅ التطبيق محدث بالفعل');
});

autoUpdater.on('error', (err) => {
    console.log('❌ خطأ في التحديث: ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "⬇️ تم تحميل " + Math.round(progressObj.percent) + '%';
    console.log(log_message);
});

autoUpdater.on('update-downloaded', () => {
    console.log('✅ تم تحميل التحديث!');
    if (mainWindow) {
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'تحديث جاهز',
            message: 'تم تحميل التحديث. سيتم إعادة تشغيل التطبيق الآن.',
            buttons: ['إعادة التشغيل', 'لاحقاً']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    }
});