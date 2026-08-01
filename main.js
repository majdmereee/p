<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مطعمي برو - Gamified Edition</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        :root {
            --bg-dark: #0b0f19; --panel-bg: #151b2b; --primary: #8b5cf6;
            --secondary: #06b6d4; --success: #10b981; --danger: #f43f5e;
            --warning: #f59e0b; --text-main: #f8fafc; --text-muted: #64748b;
            --border-color: #1e293b; --glow: 0 0 15px rgba(139, 92, 246, 0.4);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Tajawal', sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; }
        
        /* إخفاء أسهم حقول الأرقام تماماً وإجبار الكتابة السلسة */
        input[type="number"] { -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button, 
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input, select { font-size: 16px; }

        .sidebar { width: 280px; background: var(--panel-bg); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; padding: 25px 20px; z-index: 10; box-shadow: 2px 0 20px rgba(0,0,0,0.5); }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(45deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; display: flex; align-items: center; gap: 10px; }
        .nav-item { padding: 15px; margin-bottom: 10px; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 15px; color: var(--text-muted); font-weight: 700; }
        .nav-item:hover, .nav-item.active { background: var(--primary); color: #fff; box-shadow: var(--glow); transform: translateX(-5px); }
        .secret-tab { color: #475569; } .secret-tab:hover { color: var(--warning); background: transparent; box-shadow: none; transform: none; }

        .main-content { flex: 1; padding: 35px; overflow-y: auto; position: relative; scroll-behavior: smooth; }
        .section-page { display: none; } .section-page.active { display: block; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        .btn { background: var(--border-color); color: #fff; border: 1px solid transparent; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .btn-primary { background: linear-gradient(45deg, var(--primary), #6d28d9); box-shadow: var(--glow); border: none; }
        .btn-success { background: linear-gradient(45deg, var(--success), #059669); }
        .btn-danger { background: linear-gradient(45deg, var(--danger), #be123c); }
        .btn-warning { background: linear-gradient(45deg, var(--warning), #b45309); }
        .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px; margin-bottom: 35px; }
        .card { background: var(--panel-bg); padding: 25px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary); }
        .card.emerald::before { background: var(--success); } .card.rose::before { background: var(--danger); }
        .card h3 { color: var(--text-muted); font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; } 
        .card h2 { font-size: 28px; font-weight: 900; }
        .card .icon { font-size: 35px; padding: 15px; border-radius: 15px; }

        .panel { background: var(--panel-bg); padding: 30px; border-radius: 20px; border: 1px solid var(--border-color); margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-top: 15px; }
        th, td { padding: 15px; text-align: right; background: rgba(30, 41, 59, 0.3); }
        th { color: var(--secondary); font-weight: 700; background: transparent; border-bottom: 2px solid var(--border-color); }
        td:first-child { border-radius: 0 12px 12px 0; } td:last-child { border-radius: 12px 0 0 12px; }
        
        /* ProgressBar Gamification */
        .progress-wrapper { width: 100%; background: var(--bg-dark); border-radius: 10px; height: 10px; overflow: hidden; margin-top: 5px; border: 1px solid var(--border-color); }
        .progress-bar { height: 100%; background: linear-gradient(90deg, var(--secondary), var(--primary)); border-radius: 10px; transition: width 0.5s ease; }

        .badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; }
        .badge-pos { background: rgba(16, 185, 129, 0.2); color: var(--success); }
        .badge-neg { background: rgba(244, 63, 94, 0.2); color: var(--danger); }
        
        /* Modals */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: none; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: var(--panel-bg); padding: 40px; border-radius: 20px; width: 550px; border: 1px solid var(--border-color); max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 10px; color: var(--secondary); font-weight: bold; }
        .form-group input, .form-group select { width: 100%; padding: 15px; border-radius: 12px; background: var(--bg-dark); color: #fff; border: 2px solid var(--border-color); transition: 0.3s; }
        .form-group input:focus, .form-group select:focus { border-color: var(--primary); box-shadow: var(--glow); outline: none; }
        .modal-actions { display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px; }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="logo"><i class="fa-solid fa-gamepad"></i> مطعمي برو</div>
        <div class="nav-item active" data-target="dashboard"><i class="fa-solid fa-chart-line"></i> لوحة القيادة</div>
        <div class="nav-item" data-target="employees"><i class="fa-solid fa-users"></i> الموظفين</div>
        <div class="nav-item" data-target="attendance"><i class="fa-solid fa-stopwatch"></i> الساعات والإضافي</div>
        <div class="nav-item" data-target="finances"><i class="fa-solid fa-coins"></i> الدفعات والمالية</div>
        <div class="nav-item" data-target="closed-boxes"><i class="fa-solid fa-box-archive"></i> الصناديق المغلقة</div>
        <div class="nav-item" data-target="reports"><i class="fa-solid fa-file-export"></i> التصدير</div>
        <div class="nav-item secret-tab" onclick="unlockSecretNotes()"><i class="fa-solid fa-lock"></i> ملاحظات الإدارة</div>
        <div class="nav-item" style="margin-top: auto;" data-target="settings"><i class="fa-solid fa-gear"></i> الإعدادات</div>
    </div>

    <div class="main-content">
        
        <!-- Dashboard -->
        <div id="dashboard" class="section-page active">
            <div class="header">
                <div>
                    <h1>لوحة القيادة - الصندوق الحالي</h1>
                    <p style="color: var(--secondary);" id="box-date-label"></p>
                </div>
                <button class="btn btn-danger" onclick="closeBoxSafe()"><i class="fa-solid fa-box-open"></i> إغلاق الصندوق الحالي</button>
            </div>
            <div class="cards-grid">
                <div class="card emerald">
                    <div><h3>المتبقي للدفع (رواتب)</h3><h2 id="dash-remaining">0</h2></div>
                    <div class="icon" style="color: var(--success); background: rgba(16,185,129,0.1);"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                </div>
                <div class="card rose">
                    <div><h3>إجمالي السلف بالصندوق</h3><h2 id="dash-advances">0</h2></div>
                    <div class="icon" style="color: var(--danger); background: rgba(244,63,94,0.1);"><i class="fa-solid fa-money-bill-transfer"></i></div>
                </div>
                <div class="card">
                    <div><h3>ساعات الإضافي الكلية</h3><h2 id="dash-overtime">0</h2></div>
                    <div class="icon" style="color: var(--primary); background: rgba(139,92,246,0.1);"><i class="fa-solid fa-bolt"></i></div>
                </div>
            </div>
        </div>

        <!-- Employees -->
        <div id="employees" class="section-page">
            <div class="header"><h1>الموظفين</h1><button class="btn btn-primary" onclick="openEmpModal()"><i class="fa-solid fa-plus"></i> إضافة موظف</button></div>
            <div class="panel"><table id="emp-table"><thead><tr><th>الاسم</th><th>المنصب</th><th>الراتب الأساسي</th><th>سعر الساعة</th><th>إجراء</th></tr></thead><tbody id="emp-body"></tbody></table></div>
        </div>

        <!-- Attendance & Overtime -->
        <div id="attendance" class="section-page">
            <div class="header"><h1>تسجيل الساعات والإضافي</h1></div>
            <div class="panel">
                <table id="att-table">
                    <thead><tr><th>الموظف</th><th>الساعات العادية</th><th>الساعات الإضافية (x1.5)</th><th>إضافة ساعات جديدة</th></tr></thead>
                    <tbody id="att-body"></tbody>
                </table>
            </div>
        </div>

        <!-- Finances & Payments -->
        <div id="finances" class="section-page">
            <div class="header"><h1>الدفعات والتصفية المالية</h1></div>
            <div class="panel">
                <table id="fin-table">
                    <thead><tr><th>الموظف</th><th>إجمالي الراتب</th><th>تم دفعه</th><th>المتبقي له</th><th>العمليات</th></tr></thead>
                    <tbody id="fin-body"></tbody>
                </table>
            </div>
        </div>

        <!-- Closed Boxes -->
        <div id="closed-boxes" class="section-page">
            <div class="header"><h1>الصناديق القديمة المؤرشفة</h1></div>
            <div class="panel"><table id="boxes-table"><thead><tr><th>تاريخ البداية</th><th>تاريخ الإغلاق</th><th>عدد المعاملات</th><th>إجمالي المدفوعات</th></tr></thead><tbody id="boxes-body"></tbody></table></div>
        </div>

        <!-- Secret Notes -->
        <div id="secret-notes" class="section-page">
            <div class="header">
                <h1 style="color: var(--warning);"><i class="fa-solid fa-user-secret"></i> السجل السري للإدارة</h1>
                <button class="btn btn-warning" onclick="openNoteModal()"><i class="fa-solid fa-plus"></i> إضافة ملاحظة</button>
            </div>
            <div class="panel"><table id="notes-table"><thead><tr><th>الموظف</th><th>نوع الملاحظة</th><th>التفاصيل</th><th>التاريخ</th></tr></thead><tbody id="notes-body"></tbody></table></div>
        </div>

        <!-- Export -->
        <div id="reports" class="section-page">
            <div class="header"><h1>تصدير البيانات للصندوق الحالي</h1></div>
            <div class="panel">
                <div class="form-group"><label>تضمين الملاحظات السرية؟ (يتطلب كلمة سر)</label><select id="exp-notes"><option value="no">لا</option><option value="yes">نعم، تضمين</option></select></div>
                <button class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 18px;" onclick="generateReport()">توليد التقرير للنسخ</button>
                <textarea id="report-output" rows="15" style="width: 100%; margin-top: 20px; background: var(--bg-dark); color: var(--secondary); border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; display: none;" readonly></textarea>
            </div>
        </div>
        
        <!-- Settings -->
        <div id="settings" class="section-page">
            <div class="header"><h1>الإعدادات</h1></div>
            <div class="panel" style="max-width: 400px;"><div class="form-group"><label>العملة</label><input type="text" id="set-currency"></div><button class="btn btn-success" onclick="saveSettings()">حفظ</button></div>
        </div>

    </div>

    <!-- === Modals === -->
    
    <!-- Add/Edit Employee -->
    <div class="modal-overlay" id="empModal">
        <div class="modal">
            <h2 id="empModalTitle" style="color:var(--primary); margin-bottom:20px;">موظف</h2>
            <input type="hidden" id="empId">
            <div class="form-group"><label>الاسم</label><input type="text" id="empName"></div>
            <div class="form-group"><label>المنصب</label><input type="text" id="empRole"></div>
            <div class="form-group"><label>الراتب الأساسي الثابت</label><input type="number" id="empBase"></div>
            <div class="form-group"><label>سعر الساعة</label><input type="number" id="empHourly"></div>
            <div class="modal-actions"><button class="btn btn-danger" onclick="closeModals()">إلغاء</button><button class="btn btn-primary" onclick="saveEmployee()">حفظ</button></div>
        </div>
    </div>

    <!-- Add Hours -->
    <div class="modal-overlay" id="hoursModal">
        <div class="modal">
            <h2 style="color:var(--secondary); margin-bottom:20px;">تسجيل ساعات عمل</h2>
            <input type="hidden" id="hoursEmpId">
            <div class="form-group"><label>ساعات عادية</label><input type="number" id="hNormal" value="0"></div>
            <div class="form-group"><label>ساعات إضافية (مضاعفة)</label><input type="number" id="hOver" value="0"></div>
            <div class="modal-actions"><button class="btn btn-danger" onclick="closeModals()">إلغاء</button><button class="btn btn-primary" onclick="saveHours()">حفظ الساعات</button></div>
        </div>
    </div>

    <!-- Add Finance Transaction (Payment, Advance, etc) -->
    <div class="modal-overlay" id="finModal">
        <div class="modal">
            <h2 style="color:var(--success); margin-bottom:20px;">إجراء مالي</h2>
            <input type="hidden" id="finEmpId">
            <div class="form-group"><label>نوع العملية</label>
                <select id="finType">
                    <option value="payment">تسليم دفعة (دفع راتب)</option>
                    <option value="advance">سلفة مالية (خصم)</option>
                    <option value="deduction">خصم / عقوبة</option>
                    <option value="bonus">مكافأة / إكرامية</option>
                </select>
            </div>
            <div class="form-group"><label>المبلغ</label><input type="number" id="finAmount"></div>
            <div class="form-group"><label>ملاحظات</label><input type="text" id="finNote" placeholder="اكتب السبب..."></div>
            <div class="modal-actions"><button class="btn btn-danger" onclick="closeModals()">إلغاء</button><button class="btn btn-success" onclick="saveFin()">تنفيذ</button></div>
        </div>
    </div>

    <!-- Add Secret Note -->
    <div class="modal-overlay" id="noteModal">
        <div class="modal">
            <h2 style="color:var(--warning); margin-bottom:20px;">إضافة ملاحظة إدارية</h2>
            <div class="form-group"><label>الموظف</label><select id="noteEmpId"></select></div>
            <div class="form-group"><label>النوع</label><select id="noteType"><option value="إيجابية">إيجابية 🌟</option><option value="سلبية">سلبية ❌</option><option value="عادية">ملاحظة عادية 📝</option></select></div>
            <div class="form-group"><label>التفاصيل</label><input type="text" id="noteText"></div>
            <div class="modal-actions"><button class="btn btn-danger" onclick="closeModals()">إلغاء</button><button class="btn btn-warning" onclick="saveNote()">حفظ الملاحظة</button></div>
        </div>
    </div>

    <script>
        const { ipcRenderer } = require('electron');
        let db = { employees: [], currentBox: { transactions: [], attendance: [], payments: [], notes: [] }, closedBoxes: [], settings: { currency: '$' } };
        let secretUnlocked = false;

        document.addEventListener('DOMContentLoaded', async () => {
            db = await ipcRenderer.invoke('get-db');
            setupTabs(); updateUI();
            document.getElementById('set-currency').value = db.settings.currency;
        });

        function setupTabs() {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    if(this.classList.contains('secret-tab')) return;
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                    document.querySelectorAll('.section-page').forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    document.getElementById(this.dataset.target).classList.add('active');
                });
            });
        }

        async function saveDB() { await ipcRenderer.invoke('save-db', db); updateUI(); }
        function closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none'); }

        // --- محرك الحسابات الجبار ---
        function calcFinances(empId) {
            const emp = db.employees.find(e => e.id === empId); if(!emp) return null;
            
            let nHours = 0, oHours = 0;
            db.currentBox.attendance.filter(a => a.empId === empId).forEach(a => { nHours += Number(a.normal); oHours += Number(a.over); });
            const earnings = nHours * Number(emp.hourlyRate) + (oHours * Number(emp.hourlyRate) * 1.5);
            
            let adv = 0, ded = 0, bon = 0;
            db.currentBox.transactions.filter(t => t.empId === empId).forEach(t => {
                if(t.type === 'advance') adv += Number(t.amount);
                if(t.type === 'deduction') ded += Number(t.amount);
                if(t.type === 'bonus') bon += Number(t.amount);
            });

            let paid = 0;
            db.currentBox.payments.filter(p => p.empId === empId).forEach(p => paid += Number(p.amount));

            const netSalary = Number(emp.baseSalary) + earnings + bon - adv - ded;
            const remaining = netSalary - paid;
            const progress = netSalary > 0 ? Math.min((paid / netSalary) * 100, 100) : 0;

            return { nHours, oHours, adv, ded, bon, paid, netSalary, remaining, progress };
        }

        // --- تحديث الواجهات ---
        function updateUI() {
            const c = db.settings.currency;
            document.getElementById('box-date-label').innerText = `تم فتح الصندوق بتاريخ: ${new Date(db.currentBox.startDate).toLocaleDateString('ar-EG')}`;
            
            let tRem = 0, tAdv = 0, tOver = 0;
            
            // تحديث الموظفين
            document.getElementById('emp-body').innerHTML = '';
            document.getElementById('att-body').innerHTML = '';
            document.getElementById('fin-body').innerHTML = '';
            
            db.employees.forEach(emp => {
                const f = calcFinances(emp.id);
                tRem += f.remaining; tAdv += f.adv; tOver += f.oHours;
                
                // Employees
                document.getElementById('emp-body').innerHTML += `<tr><td>${emp.name}</td><td>${emp.role}</td><td>${emp.baseSalary}${c}</td><td>${emp.hourlyRate}${c}</td><td><button class="btn btn-primary" onclick="editEmp(${emp.id})">تعديل</button></td></tr>`;
                
                // Attendance
                document.getElementById('att-body').innerHTML += `<tr><td>${emp.name}</td><td>${f.nHours}</td><td>${f.oHours}</td><td><button class="btn btn-success" onclick="openHours(${emp.id})">إضافة ساعات</button></td></tr>`;
                
                // Finances (Progress bar applied)
                document.getElementById('fin-body').innerHTML += `<tr>
                    <td><strong>${emp.name}</strong></td>
                    <td>${f.netSalary}${c}</td>
                    <td style="color:var(--success)">${f.paid}${c}</td>
                    <td>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>${f.remaining}${c}</span></div>
                        <div class="progress-wrapper"><div class="progress-bar" style="width: ${f.progress}%"></div></div>
                    </td>
                    <td><button class="btn btn-warning" onclick="openFin(${emp.id})">إجراء مالي/دفع</button></td>
                </tr>`;
            });

            document.getElementById('dash-remaining').innerText = tRem + c;
            document.getElementById('dash-advances').innerText = tAdv + c;
            document.getElementById('dash-overtime').innerText = tOver + ' س';
            
            // Closed Boxes
            document.getElementById('boxes-body').innerHTML = '';
            db.closedBoxes.forEach(b => {
                let boxPaid = b.payments.reduce((sum, p) => sum + Number(p.amount), 0);
                document.getElementById('boxes-body').innerHTML += `<tr><td>${new Date(b.startDate).toLocaleDateString()}</td><td>${new Date(b.endDate).toLocaleDateString()}</td><td>${b.transactions.length + b.attendance.length} حركة</td><td>${boxPaid}${c}</td></tr>`;
            });

            // Secret Notes Dropdown Update
            if(secretUnlocked) renderNotes();
        }

        // --- الإجراءات والنوافذ ---
        function openEmpModal() { document.getElementById('empId').value = ''; document.getElementById('empModal').style.display = 'flex'; }
        function editEmp(id) { const e = db.employees.find(x => x.id === id); document.getElementById('empId').value = e.id; document.getElementById('empName').value = e.name; document.getElementById('empRole').value = e.role; document.getElementById('empBase').value = e.baseSalary; document.getElementById('empHourly').value = e.hourlyRate; document.getElementById('empModal').style.display = 'flex'; }
        function saveEmployee() {
            const id = document.getElementById('empId').value;
            const data = { id: id ? Number(id) : Date.now(), name: document.getElementById('empName').value, role: document.getElementById('empRole').value, baseSalary: document.getElementById('empBase').value || 0, hourlyRate: document.getElementById('empHourly').value || 0 };
            if(id) { db.employees[db.employees.findIndex(e => e.id == id)] = data; } else { db.employees.push(data); }
            closeModals(); saveDB();
        }

        function openHours(id) { document.getElementById('hoursEmpId').value = id; document.getElementById('hNormal').value = ''; document.getElementById('hOver').value = ''; document.getElementById('hoursModal').style.display = 'flex'; }
        function saveHours() {
            db.currentBox.attendance.push({ id: Date.now(), empId: Number(document.getElementById('hoursEmpId').value), normal: document.getElementById('hNormal').value || 0, over: document.getElementById('hOver').value || 0, date: new Date().toISOString() });
            closeModals(); saveDB();
        }

        function openFin(id) { document.getElementById('finEmpId').value = id; document.getElementById('finAmount').value = ''; document.getElementById('finNote').value = ''; document.getElementById('finModal').style.display = 'flex'; }
        function saveFin() {
            const eId = Number(document.getElementById('finEmpId').value), type = document.getElementById('finType').value, amount = document.getElementById('finAmount').value, note = document.getElementById('finNote').value;
            if(!amount) return;
            if(type === 'payment') { db.currentBox.payments.push({ id: Date.now(), empId: eId, amount, note, date: new Date().toISOString() }); }
            else { db.currentBox.transactions.push({ id: Date.now(), empId: eId, type, amount, note, date: new Date().toISOString() }); }
            closeModals(); saveDB();
        }

        // --- الملاحظات السرية ---
        function unlockSecretNotes() {
            if(secretUnlocked) { showSecretTab(); return; }
            const pw = prompt("أدخل كلمة السر للوصول لسجل الإدارة:");
            if(pw === 'عبد') { secretUnlocked = true; showSecretTab(); } else { alert("كلمة السر خاطئة!"); }
        }
        function showSecretTab() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.section-page').forEach(s => s.classList.remove('active'));
            document.querySelector('.secret-tab').classList.add('active');
            document.getElementById('secret-notes').classList.add('active');
            renderNotes();
        }
        function openNoteModal() {
            document.getElementById('noteEmpId').innerHTML = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            document.getElementById('noteText').value = ''; document.getElementById('noteModal').style.display = 'flex';
        }
        function saveNote() {
            db.currentBox.notes.push({ id: Date.now(), empId: Number(document.getElementById('noteEmpId').value), type: document.getElementById('noteType').value, text: document.getElementById('noteText').value, date: new Date().toISOString() });
            closeModals(); saveDB();
        }
        function renderNotes() {
            document.getElementById('notes-body').innerHTML = '';
            db.currentBox.notes.forEach(n => {
                const e = db.employees.find(x => x.id === n.empId);
                let badge = n.type === 'إيجابية' ? 'badge-pos' : (n.type === 'سلبية' ? 'badge-neg' : 'badge');
                document.getElementById('notes-body').innerHTML += `<tr><td>${e ? e.name : 'محذوف'}</td><td><span class="badge ${badge}">${n.type}</span></td><td>${n.text}</td><td>${new Date(n.date).toLocaleDateString()}</td></tr>`;
            });
        }

        // --- إغلاق الصندوق والتصدير ---
        function closeBoxSafe() {
            if(confirm("هل أنت متأكد من إغلاق الصندوق الحالي وتصفيره لبدء صندوق جديد؟ (سيتم حفظ كل البيانات بالأرشيف)")) {
                db.currentBox.endDate = new Date().toISOString();
                db.closedBoxes.push(JSON.parse(JSON.stringify(db.currentBox)));
                db.currentBox = { id: Date.now(), startDate: new Date().toISOString(), transactions: [], attendance: [], payments: [], notes: [] };
                saveDB(); alert("تم فتح صندوق جديد بنجاح!");
            }
        }

        function generateReport() {
            const incNotes = document.getElementById('exp-notes').value === 'yes';
            if(incNotes) { const pw = prompt("تصدير الملاحظات يتطلب كلمة السر:"); if(pw !== 'عبد') { alert("مرفوض!"); return; } }
            
            let r = `📊 *تقرير الصندوق الحالي* 📊\nالتاريخ: ${new Date().toLocaleDateString()}\n`;
            db.employees.forEach(emp => {
                const f = calcFinances(emp.id);
                r += `\n👤 *${emp.name}*\n- إجمالي الراتب المستحق: ${f.netSalary}${db.settings.currency}\n- تم دفع: ${f.paid}${db.settings.currency}\n- المتبقي له: ${f.remaining}${db.settings.currency}\n`;
                if(incNotes) {
                    const myNotes = db.currentBox.notes.filter(n => n.empId === emp.id);
                    if(myNotes.length > 0) { r += `📝 ملاحظات الإدارة:\n`; myNotes.forEach(n => r += `  (${n.type}) ${n.text}\n`); }
                }
            });
            const out = document.getElementById('report-output'); out.value = r; out.style.display = 'block'; out.select(); document.execCommand('copy'); alert('تم النسخ!');
        }

        function saveSettings() { db.settings.currency = document.getElementById('set-currency').value || '$'; saveDB(); alert('تم الحفظ!'); }
    </script>
</body>
</html>
