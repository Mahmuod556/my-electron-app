/**
 * ui_helpers.js - مساعدات الواجهة الموحدة
 */

/**
 * نظام الإشعارات (بديل alert الصامت)
 */
function showNotification(message, type = 'success') {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

/**
 * نموذج الإدخال المخصص (بديل prompt)
 */
function showInputModal(title, defaultValue, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    overlay.innerHTML = `
        <div class="custom-modal">
            <h3>${title}</h3>
            <input type="text" id="modalInput" value="${defaultValue || ''}">
            <div class="modal-buttons">
                <button class="btn-confirm" id="modalConfirm">تأكيد</button>
                <button class="btn-cancel" id="modalCancel">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    const input = document.getElementById('modalInput');
    input.focus();
    input.select();

    const cleanup = () => { overlay.remove(); window.removeEventListener('keydown', handleKey); };
    const handleKey = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('modalConfirm').click(); }
        if (e.key === 'Escape') { e.preventDefault(); document.getElementById('modalCancel').click(); }
    };
    window.addEventListener('keydown', handleKey);

    document.getElementById('modalConfirm').onclick = () => {
        const val = input.value;
        cleanup();
        callback(val);
    };
    document.getElementById('modalCancel').onclick = () => {
        cleanup();
        callback(null);
    };
}

/**
 * نموذج التأكيد المخصص (بديل confirm)
 */
function showConfirmModal(title, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    overlay.innerHTML = `
        <div class="custom-modal">
            <h3>${title}</h3>
            <div class="modal-buttons">
                <button class="btn-confirm" id="modalConfirm">نعم</button>
                <button class="btn-cancel" id="modalCancel">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const cleanup = () => { overlay.remove(); window.removeEventListener('keydown', handleKey); };
    const handleKey = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('modalConfirm').click(); }
        if (e.key === 'Escape') { e.preventDefault(); document.getElementById('modalCancel').click(); }
    };
    window.addEventListener('keydown', handleKey);

    document.getElementById('modalConfirm').onclick = () => {
        cleanup();
        callback(true);
    };
    document.getElementById('modalCancel').onclick = () => {
        cleanup();
        callback(false);
    };
}

/**
 * بديل confirm باستخدام async/await
 */
async function asyncConfirm(title) {
    return new Promise(resolve => {
        showConfirmModal(title, resolve);
    });
}

/**
 * بديل prompt باستخدام async/await
 */
async function asyncPrompt(title, defaultValue) {
    return new Promise(resolve => {
        showInputModal(title, defaultValue, resolve);
    });
}
