const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

// تعطيل التحديث التلقائي في وضع التطوير
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    // بعد ما الويندو تفتح، شيك على التحديثات
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        // في وضع التطوير (لما تشغل بـ npm start) متشيكش
        if (!app.isPackaged) {
            console.log('🔧 Development mode - Skip update check');
            return;
        }

        // بعد 3 ثواني شيك على التحديثات
        setTimeout(() => {
            autoUpdater.checkForUpdates();
        }, 3000);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// ===== أحداث التحديث التلقائي =====

autoUpdater.on('checking-for-update', () => {
    console.log('🔍 جاري البحث عن تحديثات...');
});

autoUpdater.on('update-available', (info) => {
    console.log('✅ يوجد تحديث جديد! النسخة:', info.version);

    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'تحديث متاح',
        message: `يوجد نسخة جديدة (${info.version}).\n\nهل تريد تحميلها الآن؟`,
        buttons: ['نعم', 'لاحقاً'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});

autoUpdater.on('update-not-available', () => {
    console.log('✅ التطبيق محدث بالفعل');
});

autoUpdater.on('error', (err) => {
    console.error('❌ خطأ في التحديث:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
    let message = `⬇️ جاري التحميل... ${Math.round(progressObj.percent)}%`;
    console.log(message);

    // تحديث عنوان النافذة بنسبة التحميل
    if (mainWindow) {
        mainWindow.setTitle(`RepairApp - ${message}`);
    }
});

autoUpdater.on('update-downloaded', (info) => {
    console.log('✅ تم تحميل التحديث!');

    // إرجاع العنوان الأصلي
    if (mainWindow) {
        mainWindow.setTitle('RepairApp');
    }

    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'تحديث جاهز',
        message: 'تم تحميل التحديث بنجاح.\n\nسيتم إعادة تشغيل التطبيق الآن لتثبيت التحديث.',
        buttons: ['إعادة التشغيل الآن', 'لاحقاً'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            // إعادة التشغيل وتثبيت التحديث
            autoUpdater.quitAndInstall(false, true);
        }
    });
});