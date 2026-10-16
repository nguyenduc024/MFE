import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('mifos_dataset.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Office lookup
office_map = {o['id']: o['name'] for o in d['offices']}

# Role lookup
role_map = {r['id']: r for r in d['roles']}

# User role lookup
user_roles_map = {}
for ur in d['user_roles']:
    uid = ur['appuser_id']
    rid = ur['role_id']
    if uid not in user_roles_map:
        user_roles_map[uid] = []
    if rid in role_map:
        user_roles_map[uid].append(role_map[rid]['name'])

# Format users
formatted_users = []
for u in d['users']:
    formatted_users.append({
        'id': u['id'],
        'username': u['username'],
        'firstname': u['firstname'],
        'lastname': u['lastname'],
        'email': u['email'],
        'officeId': u['office_id'],
        'officeName': office_map.get(u['office_id'], 'Head Office'),
        'roles': user_roles_map.get(u['id'], ['Viewer']),
        'enabled': True if u.get('is_deleted') != 't' else False
    })

# Format offices
formatted_offices = []
for o in d['offices']:
    formatted_offices.append({
        'id': o['id'],
        'name': o['name'],
        'externalId': o['external_id'],
        'parentId': o['parent_id'],
        'parentName': office_map.get(o['parent_id'], None),
        'openingDate': o['opening_date'],
        'hierarchy': o.get('hierarchy', '')
    })

# Format GL Accounts
# Type mapping: 1: ASSET, 2: LIABILITY, 3: EQUITY, 4: INCOME, 5: EXPENSE
type_names = {
    '1': 'Asset',
    '2': 'Liability',
    '3': 'Equity',
    '4': 'Income',
    '5': 'Expense'
}
formatted_gl = []
for g in d['gl_accounts']:
    formatted_gl.append({
        'id': g['id'],
        'glCode': g['gl_code'],
        'name': g['name'],
        'typeId': g['classification_enum'],
        'typeName': type_names.get(g['classification_enum'], 'Other'),
        'usage': 'Header' if g['account_usage'] == '2' else 'Detail',
        'manualEntriesAllowed': True if g.get('manual_journal_entries_allowed') == 't' else False,
        'parentId': g.get('parent_id'),
        'description': g.get('description', '')
    })

# Format Products
formatted_loan_products = []
for p in d['loan_products']:
    formatted_loan_products.append({
        'id': p['id'],
        'name': p['name'],
        'shortName': p['short_name'],
        'description': p.get('description', ''),
        'currencyCode': p.get('currency_code', 'VND'),
        'currencyName': 'Dong',
        'principal': float(p.get('principal_amount') or 10000000),
        'minPrincipal': float(p.get('min_principal_amount') or 1000000),
        'maxPrincipal': float(p.get('max_principal_amount') or 50000000),
        'numberOfRepayments': int(p.get('number_of_repayments') or 12),
        'repaymentFrequency': 'Tháng (Months)',
        'interestRatePerPeriod': float(p.get('nominal_interest_rate_per_period') or 1.0),
        'annualInterestRate': 12.0,
        'interestType': 'Flat',
        'accountingRule': 'Accrual (Periodic)',
        'status': 'Active'
    })

formatted_savings_products = []
deposit_type_names = {
    '100': 'Savings (Tiền gửi thanh toán)',
    '200': 'Fixed Deposit (Tiết kiệm có kỳ hạn)',
    '300': 'Recurring Deposit (Tiết kiệm gửi góp)'
}
for p in d['savings_products']:
    formatted_savings_products.append({
        'id': p['id'],
        'name': p['name'],
        'shortName': p['short_name'],
        'description': p.get('description', ''),
        'currencyCode': p.get('currency_code', 'VND'),
        'depositType': deposit_type_names.get(p.get('deposit_type_enum'), 'Savings'),
        'depositTypeId': p.get('deposit_type_enum'),
        'nominalAnnualInterestRate': float(p.get('nominal_annual_interest_rate', 0)),
        'minBalanceForInterest': float(p.get('min_balance_for_interest_calculation', 0) or 0),
        'accountingRule': 'Cash Based' if p.get('accounting_type') == '2' else 'None'
    })

# Format Clients
formatted_clients = []
for c in d['clients']:
    formatted_clients.append({
        'id': c['id'],
        'accountNo': c['account_no'],
        'externalId': (c.get('external_id') or '').strip(),
        'displayName': c['display_name'],
        'firstname': c.get('firstname', ''),
        'lastname': c.get('lastname', ''),
        'officeId': c['office_id'],
        'officeName': office_map.get(c['office_id'], 'Head Office'),
        'status': 'Active' if c.get('status_enum') == '300' else 'Pending Approval',
        'activationDate': c.get('activation_date', '2026-10-13'),
        'mobileNo': c.get('mobile_no', '0901234567')
    })

# Format Roles
formatted_roles = []
for r in d['roles']:
    formatted_roles.append({
        'id': r['id'],
        'name': r['name'],
        'description': r.get('description', ''),
        'disabled': True if r.get('is_disabled') == 't' else False
    })

# Export to JS file
js_content = f"""// Dữ liệu mô phỏng Mifos X Core Banking - Takashimaya Bank (TKB) Sandbox
// Được trích xuất trực tiếp 100% từ file SQL thực tế: mifos_full_backup_15102026_Final_Edu.sql

export const INITIAL_BANK_INFO = {{
  bankName: "Takashimaya Bank (TKB)",
  code: "TKB",
  headOfficeId: "1",
  currency: "VND",
  timezone: "Asia/Ho_Chi_Minh"
}};

export const INITIAL_OFFICES = {json.dumps(formatted_offices, ensure_ascii=False, indent=2)};

export const INITIAL_ROLES = {json.dumps(formatted_roles, ensure_ascii=False, indent=2)};

export const INITIAL_USERS = {json.dumps(formatted_users, ensure_ascii=False, indent=2)};

export const INITIAL_GL_ACCOUNTS = {json.dumps(formatted_gl, ensure_ascii=False, indent=2)};

export const INITIAL_LOAN_PRODUCTS = {json.dumps(formatted_loan_products, ensure_ascii=False, indent=2)};

export const INITIAL_SAVINGS_PRODUCTS = {json.dumps(formatted_savings_products, ensure_ascii=False, indent=2)};

export const INITIAL_CLIENTS = {json.dumps(formatted_clients, ensure_ascii=False, indent=2)};

export const INITIAL_TELLERS = [
  {{
    id: "1",
    name: "Thu Duc Teller 01",
    officeId: "26",
    officeName: "Thu Duc Transaction Office",
    validFrom: "2026-08-05",
    validTo: null,
    state: "Active (Mở quầy)",
    cashierName: "Staff #1 (Nguyễn Văn Thu Ngân)",
    startDate: "2026-08-05",
    endDate: "2026-11-05",
    currentCashBalance: 50000000
  }}
];

export const INITIAL_FINANCIAL_ACTIVITIES = [
  {{ id: "1", activityName: "Opening Balances Contra", glCode: "310001", glName: "Retained Earnings", type: "300" }},
  {{ id: "2", activityName: "Asset Transfer", glCode: "110201", glName: "Branch Cash in Transit", type: "101" }},
  {{ id: "3", activityName: "Liability Transfer", glCode: "110202", glName: "Clearing Clearing Transit", type: "102" }},
  {{ id: "4", activityName: "Cash at Main Vault", glCode: "110101", glName: "Main Vault Cash", type: "103" }},
  {{ id: "5", activityName: "Cash at Teller", glCode: "110102", glName: "Cash at Teller", type: "100" }},
  {{ id: "6", activityName: "Customer Deposits Suspense", glCode: "210101", glName: "Suspense Account", type: "200" }}
];

export const INITIAL_ACCOUNTING_RULES = [
  {{
    id: "1",
    name: "Operating Expense Accrual",
    officeId: "1",
    officeName: "Takashimaya Bank (TKB) - HO",
    debitAccount: "530101 - General Administrative Expenses",
    creditAccount: "220101 - Accounts Payable Accrual",
    description: "Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries."
  }}
];

export const INITIAL_GL_CLOSURES = [
  {{
    id: "1",
    officeName: "Takashimaya Bank (TKB) - HO",
    closingDate: "2026-08-31",
    comments: "Month-end accounting closure for August 2026. Closing date established for testing posting restrictions.",
    closedBy: "mifos (Super user)"
  }}
];

export const INITIAL_LOANS = [
  {{
    id: "1",
    accountNo: "000000001",
    externalId: "TKB-LN-0001",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "1",
    productName: "TKB Personal Loan",
    principal: 10000000,
    annualInterestRate: 12.0,
    termMonths: 12,
    status: "Active (Đã giải ngân)",
    disbursementDate: "2026-08-15",
    totalRepaid: 2500000,
    outstandingBalance: 7500000,
    schedule: [
      {{ installment: 1, dueDate: "2026-09-15", principal: 833333, interest: 100000, total: 933333, status: "Paid" }},
      {{ installment: 2, dueDate: "2026-10-15", principal: 833333, interest: 100000, total: 933333, status: "Paid" }},
      {{ installment: 3, dueDate: "2026-11-15", principal: 833333, interest: 100000, total: 933333, status: "Pending" }},
      {{ installment: 4, dueDate: "2026-12-15", principal: 833333, interest: 100000, total: 933333, status: "Pending" }}
    ]
  }}
];

export const INITIAL_SAVINGS_ACCOUNTS = [
  {{
    id: "1",
    accountNo: "000000001",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "1",
    productName: "TKB Current Account",
    accountType: "Savings (Thanh toán)",
    balance: 15400000,
    status: "Active",
    openedDate: "2026-08-10"
  }},
  {{
    id: "2",
    accountNo: "000000002",
    clientId: "12",
    clientName: "Lan Ngoc Pham",
    productId: "1",
    productName: "TKB Current Account",
    accountType: "Savings (Thanh toán)",
    balance: 8200000,
    status: "Active",
    openedDate: "2026-08-12"
  }},
  {{
    id: "3",
    accountNo: "000000003",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "2",
    productName: "TKB Fixed Deposit",
    accountType: "Fixed Deposit (Có kỳ hạn)",
    balance: 50000000,
    status: "Active",
    termMonths: 6,
    interestRate: 6.5,
    openedDate: "2026-08-15"
  }},
  {{
    id: "4",
    accountNo: "000000004",
    clientId: "12",
    clientName: "Lan Ngoc Pham",
    productId: "3",
    productName: "TKB Goal Savings",
    accountType: "Recurring Deposit (Gửi góp)",
    balance: 12000000,
    status: "Active",
    monthlyDeposit: 2000000,
    openedDate: "2026-08-20"
  }}
];

// Danh sách bài học / Sổ tay hướng dẫn giáo dục (Edu Walkthrough)
export const EDU_MODULES = [
  {{
    id: "mod-1",
    number: "01",
    title: "Phân hệ Tổ chức & Quản lý Tiền mặt (Organization & Cash)",
    icon: "Building2",
    objective: "Thiết lập cấu trúc cây tổ chức ngân hàng (Hội sở -> Vùng -> Chi nhánh -> PGD) và quản lý bàn thu ngân (Teller/Cashier).",
    targetMenu: "admin-organization",
    subPath: "offices",
    dataSummary: [
      "Hội sở chính: Takashimaya Bank (TKB) - HO (Mã: TKB - HO - 001)",
      "3 Cấp Vùng: TKB - REG - NOR (Bắc), TKB - REG - CEN (Trung), TKB - REG - SOU (Nam)",
      "Mạng lưới: 30 Đơn vị bao gồm Chi nhánh Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng... và các PGD như Thu Duc Transaction Office",
      "Bàn thu ngân: Thu Duc Teller 01 (PGD Thủ Đức), phân bổ Cashier ngày 05/08/2026"
    ],
    steps: [
      {{ step: 1, action: "Vào menu Admin -> Organization -> Manage Offices." }},
      {{ step: 2, action: "Tạo Hội sở chính (Head Office) cấp cao nhất." }},
      {{ step: 3, action: "Tạo các Vùng miền trực thuộc Hội sở (Parent: Head Office)." }},
      {{ step: 4, action: "Tạo Chi nhánh tỉnh/thành phố trực thuộc Vùng tương ứng." }},
      {{ step: 5, action: "Tạo Phòng giao dịch trực thuộc Chi nhánh (VD: Thu Duc TO thuộc HCM Branch)." }},
      {{ step: 6, action: "Vào Tellers -> Tạo Thu Duc Teller 01 -> Allocate Cashier cho nhân viên." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Mã External ID phải chuẩn hóa quy tắc (VD: TKB-BR-HAN, TKB-TO-HCM-02). Parent Office bắt buộc phải tạo trước khi tạo chi nhánh con."
  }},
  {{
    id: "mod-2",
    number: "02",
    title: "Phân hệ Người dùng & Phân quyền Maker - Checker (Users & Roles)",
    icon: "ShieldCheck",
    objective: "Thiết lập nguyên tắc kiểm soát 4 mắt (Maker - Checker) và ma trận phân quyền theo từng nghiệp vụ ngân hàng.",
    targetMenu: "admin-users",
    subPath: "roles",
    dataSummary: [
      "16 Vai trò chuyên biệt: TKB_ACCOUNTING_MAKER, TKB_ACCOUNTING_CHECKER, TKB_LOAN_OFFICER, TKB_LOAN_APPROVER, TKB_TELLER_CASHIER...",
      "27 Tài khoản nhân sự: Phân bổ đúng chức danh và chi nhánh làm việc",
      "Nguyên tắc: Maker chỉ có quyền lập (Initiate), Checker/Supervisor có quyền duyệt (Approve/Disburse)"
    ],
    steps: [
      {{ step: 1, action: "Vào menu Admin -> Users -> Roles & Permissions." }},
      {{ step: 2, action: "Tạo các Role theo chuẩn ngân hàng (Maker, Checker, Manager từng mảng)." }},
      {{ step: 3, action: "Gán quyền chi tiết (Permissions) cho từng Role (Portfolio, Accounting, Loan...)." }},
      {{ step: 4, action: "Vào Manage Users -> Tạo tài khoản nhân viên (Username, Email, Office, Gán Role)." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Tuyệt đối không cấp quyền Approve hoặc Disburse cho các tài khoản Maker (vi phạm nguyên tắc phân quyền kiểm soát nội bộ)."
  }},
  {{
    id: "mod-3",
    number: "03",
    title: "Phân hệ Kế toán & Sổ cái (Accounting & Chart of Accounts)",
    icon: "BookOpen",
    objective: "Xây dựng hệ thống tài khoản kế toán COA đa cấp, ánh xạ hoạt động tài chính, quy tắc kế toán và khóa sổ.",
    targetMenu: "accounting",
    subPath: "coa",
    dataSummary: [
      "Hệ thống 70 tài khoản GL: Đầy đủ 5 loại (1-Tài sản, 2-Nợ phải trả, 3-Vốn CSH, 4-Thu nhập, 5-Chi phí)",
      "Cấu trúc tài khoản: Tài khoản Header (Cấp 1, Cấp 2) và Tài khoản Detail (để hạch toán)",
      "6 Financial Activity Mappings: Ánh xạ tiền mặt tại quỹ, tiền chuyển tiếp, số dư đầu kỳ...",
      "Quy tắc kế toán: Operating Expense Accrual (Nợ 530101, Có 220101)",
      "Khóa sổ GL Closure: Đã thực hiện chốt sổ tháng 08/2026 tại Hội sở"
    ],
    steps: [
      {{ step: 1, action: "Vào Accounting -> Chart of Accounts -> Khởi tạo các tài khoản Header cấp cao (100000, 200000...)." }},
      {{ step: 2, action: "Tạo các tài khoản Detail con trực thuộc đúng cha." }},
      {{ step: 3, action: "Vào Financial Activity Mappings -> Ánh xạ Cash at Teller, Asset Transfer..." }},
      {{ step: 4, action: "Vào Accounting Rules -> Thiết lập bút toán chi phí trích trước (Accrual)." }},
      {{ step: 5, action: "Vào Closing Entries -> Thiết lập ngày khóa sổ cuối tháng 08/2026." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Chỉ có tài khoản Detail mới được phép hạch toán (Manual Journal Entries Allowed). Tài khoản Header dùng để tổng hợp báo cáo."
  }},
  {{
    id: "mod-4",
    number: "04",
    title: "Phân hệ Sản phẩm Tín dụng & Tiền gửi (Products Management)",
    icon: "Package",
    objective: "Cấu hình sản phẩm cho vay cá nhân và 3 loại hình huy động tiền gửi (tiết kiệm không kỳ hạn, có kỳ hạn, gửi góp).",
    targetMenu: "admin-products",
    subPath: "loans",
    dataSummary: [
      "Cho vay: TKB Personal Loan (Hạn mức: 10.000.000 VND, Lãi suất: 12%/năm, Kỳ hạn: 12 tháng, Trả nợ định kỳ hàng tháng)",
      "Tiền gửi thanh toán: TKB Current Account (deposit_type: 100)",
      "Tiết kiệm có kỳ hạn: TKB Fixed Deposit (deposit_type: 200, kỳ hạn 6 tháng, lãi suất 6.5%)",
      "Tiết kiệm gửi góp: TKB Goal Savings (deposit_type: 300, gửi góp định kỳ hàng tháng)"
    ],
    steps: [
      {{ step: 1, action: "Vào Admin -> Products -> Loan Products -> Tạo mới TKB Personal Loan." }},
      {{ step: 2, action: "Cấu hình điều khoản vay: Tiền tệ VND, số tiền gốc 10tr, phương thức trả gốc/lãi." }},
      {{ step: 3, action: "Liên kết tài khoản kế toán (Accounting Integration) với các tài khoản GL tương ứng." }},
      {{ step: 4, action: "Vào Savings Products -> Tạo TKB Current Account." }},
      {{ step: 5, action: "Vào Fixed Deposit Products & Recurring Deposit Products -> Thiết lập kỳ hạn và biểu lãi suất." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Phần hạch toán kế toán sản phẩm (Accounting) phải khớp chính xác với mã GL đã tạo ở Phân hệ 3."
  }},
  {{
    id: "mod-5",
    number: "05",
    title: "Phân hệ Khách hàng & Mở tài khoản (Client Onboarding)",
    icon: "Users",
    objective: "Tạo hồ sơ khách hàng định danh CIF theo chi nhánh và kích hoạt trạng thái hoạt động.",
    targetMenu: "clients",
    subPath: "list",
    dataSummary: [
      "10 Khách hàng tại Hội sở (TKB-CUS-001 đến 010): Minh Nguyen, Lan Tran, Anh Le...",
      "2 Khách hàng VIP tại PGD Thủ Đức: Minh Quang Tran (TKB-CIF-TDU-001) & Lan Ngoc Pham (TKB-CIF-TDU-002)",
      "Trạng thái: Active (300) sau khi được thẩm định và kích hoạt"
    ],
    steps: [
      {{ step: 1, action: "Vào menu Clients -> Bấm nút '+ Create Client'." }},
      {{ step: 2, action: "Chọn Chi nhánh trực thuộc (VD: Thu Duc Transaction Office)." }},
      {{ step: 3, action: "Nhập Họ tên, Ngày sinh, Số CCCD/Mobile và Mã định danh External ID." }},
      {{ step: 4, action: "Submit hồ sơ -> Dùng tài khoản Checker để kích hoạt (Activate Client)." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Ngày kích hoạt (Activation Date) không được trước ngày mở chi nhánh."
  }},
  {{
    id: "mod-6",
    number: "06",
    title: "Phân hệ Vận hành Giao dịch Tín dụng & Tiết kiệm (Core Operations)",
    icon: "ArrowLeftRight",
    objective: "Thực hiện chu trình tín dụng khép kín (Khởi tạo hồ sơ vay -> Phê duyệt -> Giải ngân -> Thu nợ) và giao dịch tiền gửi.",
    targetMenu: "clients",
    subPath: "operations",
    dataSummary: [
      "Hợp đồng vay #000000001 (KH: Minh Quang Tran): Giải ngân 10.000.000 VND ngày 15/08/2026",
      "Đã thu nợ 2 kỳ (Tổng đã thu: 2.500.000 VND, Dư nợ còn lại: 7.500.000 VND)",
      "Tài khoản thanh toán #000000001: Số dư 15.400.000 VND",
      "Sổ tiết kiệm có kỳ hạn #000000003: Số dư 50.000.000 VND (kỳ hạn 6 tháng)",
      "Giao dịch chuyển khoản & Nhật ký sổ cái tự động phát sinh 75 bút toán"
    ],
    steps: [
      {{ step: 1, action: "Vào hồ sơ khách hàng Minh Quang Tran -> Bấm '+ New Loan'." }},
      {{ step: 2, action: "Chọn sản phẩm TKB Personal Loan -> Điền số tiền 10tr -> Submit." }},
      {{ step: 3, action: "Đăng nhập tkb.loan.approver01 -> Phê duyệt hồ sơ vay (Approve Loan)." }},
      {{ step: 4, action: "Giải ngân khoản vay (Disburse Loan) vào tài khoản hoặc nhận tiền mặt tại quầy." }},
      {{ step: 5, action: "Thực hiện giao dịch trả nợ định kỳ (Repayment) cho kỳ 1 và kỳ 2." }},
      {{ step: 6, action: "Vào Accounting -> Search Journal Entries để kiểm tra bút toán phát sinh tự động." }}
    ],
    gradingNotes: "⚠️ Lưu ý: Thứ tự bắt buộc: Apply -> Approve -> Disburse -> Repayments. Không thể giải ngân nếu chưa được phê duyệt."
  }}
];
"""

import os
os.makedirs('src/data', exist_ok=True)
with open('src/data/mifosData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Generated src/data/mifosData.js successfully!")
