// ✅ تحميل البيانات من LocalStorage
let repairs = JSON.parse(localStorage.getItem("repairs")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

// ✅ عرض الأجهزة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    showRepairs();
    showSales();
});

// ✅ عند حفظ جهاز جديد
const repairForm = document.getElementById("repairForm");
if (repairForm) {
    repairForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const customerName = document.getElementById("customerName").value;
        const phoneModel = document.getElementById("phoneModel").value;
        const problem = document.getElementById("problem").value;
        const price = document.getElementById("price").value;
        const status = document.getElementById("status").value;
        const date = new Date().toLocaleDateString();

        const newRepair = {
            id: Date.now(),
            customerName,
            phoneModel,
            problem,
            price,
            status,
            date
        };

        repairs.push(newRepair);
        localStorage.setItem("repairs", JSON.stringify(repairs));

        // إضافة الصيانة للسجل العام
        addToRecords({
            id: newRepair.id,
            type: "صيانة",
            customerName: newRepair.customerName,
            device: newRepair.phoneModel,
            problem: newRepair.problem,
            price: newRepair.price,
            status: newRepair.status,
            date: newRepair.date
        });

        repairForm.reset();
        showRepairs();
    });
}

// ✅ دالة عرض الأجهزة في الجدول
function showRepairs() {
    const tableBody = document.querySelector("#repairsTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    repairs.forEach((r) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${r.customerName}</td>
            <td>${r.phoneModel}</td>
            <td>${r.problem}</td>
            <td>${r.price} ج.م</td>
            <td>${r.status}</td>
            <td>${r.date}</td>
            <td>
                <button onclick="deleteRepair(${r.id})">🗑️ حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ✅ دالة حذف الجهاز
function deleteRepair(id) {
    const repairToDelete = repairs.find(r => r.id === id);
    if (repairToDelete) {
        // عرض نموذج كلمة المرور
        document.getElementById('passwordModal').style.display = 'flex';

        // إزالة المستمع السابق إذا كان موجود
        document.getElementById('submitPassword').removeEventListener('click', passwordSubmitHandler);

        // إضافة المستمع للحدث click
        document.getElementById('submitPassword').addEventListener('click', passwordSubmitHandler);

        // دالة التحقق من كلمة المرور
        function passwordSubmitHandler() {
            const enteredPassword = document.getElementById('password').value;

            if (enteredPassword === "11225588") { // تأكد من أن كلمة المرور صحيحة
                // إذا كانت كلمة المرور صحيحة، يتم الحذف
                repairs = repairs.filter(r => r.id !== id);
                localStorage.setItem("repairs", JSON.stringify(repairs));
                showRepairs();
                // إخفاء نافذة كلمة المرور بعد التحقق من كلمة المرور
                document.getElementById('passwordModal').style.display = 'none'; // إخفاء النموذج
            } else {
                alert("كلمة المرور خاطئة");
            }
        }
    }
}

// ✅ عندما يضيف المستخدم عملية بيع
const salesForm = document.getElementById("salesForm");
if (salesForm) {
    salesForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const productName = document.getElementById("productName").value;
        const price = Number(document.getElementById("price").value);
        const quantity = Number(document.getElementById("quantity").value);
        const total = price * quantity;
        const date = new Date().toLocaleString();

        const newSale = {
            id: Date.now(),
            productName,
            price,
            quantity,
            total,
            date
        };

        sales.push(newSale);
        localStorage.setItem("sales", JSON.stringify(sales));

        // إضافة البيع للسجل العام
        addToRecords({
            id: newSale.id,
            type: "بيع",
            productName: newSale.productName,
            price: newSale.price,
            quantity: newSale.quantity,
            total: newSale.total,
            date: newSale.date
        });

        salesForm.reset();
        showSales();
    });
}

// ✅ دالة عرض المبيعات في الجدول
function showSales() {
    const tableBody = document.querySelector("#salesTable tbody");
    const totalSalesSpan = document.getElementById("totalSales");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    let totalSales = 0;

    sales.forEach((s) => {
        totalSales += s.total;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.productName}</td>
            <td>${s.price} ج.م</td>
            <td>${s.quantity}</td>
            <td>${s.total} ج.م</td>
            <td>${s.date}</td>
            <td>
                <button onclick="deleteSale(${s.id})">🗑️ حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    totalSalesSpan.textContent = totalSales.toFixed(2);
}

// ✅ دالة حذف بيع معين
function deleteSale(id) {
    sales = sales.filter(s => s.id !== id);
    localStorage.setItem("sales", JSON.stringify(sales));
    showSales();
}

// ✅ دالة إضافة السجل إلى السجل العام
function addToRecords(entry) {
    records.push(entry);
    localStorage.setItem("records", JSON.stringify(records));
}

// توصيل البوت مع API تليجرام
const telegramToken = "8582531529:AAFD8mdyDSXfo__MqcvhV8KbQUKSNNjUuC8"; // API Token الخاص بالبوت
const chatId = "1724117996"; // Chat ID الخاص بالمحادثة

let devices = []; // مصفوفة لتخزين الأجهزة قبل إرسالها

// دالة لإرسال الرسائل إلى تليجرام
function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log("Message sent:", data))
    .catch(error => console.error("Error sending message:", error));
}

// التعامل مع إضافة جهاز جديد
document.getElementById('repairForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // جلب القيم من الحقول
    const customerName = document.getElementById('customerName').value.trim();
    const phoneModel = document.getElementById('phoneModel').value.trim();
    const problem = document.getElementById('problem').value.trim();
    const price = document.getElementById('price').value.trim();
    const status = document.getElementById('status').value.trim();

    // التحقق من الحقول
    if (!customerName || !phoneModel || !problem || !price || !status) {
        alert("الرجاء ملء جميع الحقول!");
        return;
    }

    // إضافة الجهاز إلى المصفوفة
    const newDevice = {
        customerName,
        phoneModel,
        problem,
        price,
        status,
        date: new Date().toLocaleString(),
    };
    
    devices.push(newDevice); // إضافة الجهاز إلى المصفوفة

    // إضافة الجهاز إلى الجدول
    const repairsTable = document.getElementById('repairsTable').getElementsByTagName('tbody')[0];
    const newRow = repairsTable.insertRow();
    newRow.innerHTML = `
        <td>${customerName}</td>
        <td>${phoneModel}</td>
        <td>${problem}</td>
        <td>${price}</td>
        <td>${status}</td>
        <td>${newDevice.date}</td>
        <td><button class="deleteBtn">حذف</button></td>
    `;

    // مسح الحقول بعد الإضافة
    document.getElementById('repairForm').reset();
});

// إرسال البيانات إلى تليجرام دفعة واحدة
document.getElementById('sendToTelegram').addEventListener('click', function() {
    if (devices.length === 0) {
        alert("لا توجد بيانات لإرسالها.");
        return;
    }

    let message = "الأجهزة المسجلة:\n\n";
    
    devices.forEach((device, index) => {
        message += `الجهاز ${index + 1}:\n`;
        message += `العميل: ${device.customerName}\n`;
        message += `الجهاز: ${device.phoneModel}\n`;
        message += `العطل: ${device.problem}\n`;
        message += `السعر: ${device.price}\n`;
        message += `الحالة: ${device.status}\n`;
        message += `تاريخ التسجيل: ${device.date}\n\n`;
    });

    // إرسال الرسالة إلى تليجرام
    sendTelegramMessage(message);

    // مسح المصفوفة بعد الإرسال
    devices = [];
});
