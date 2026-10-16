# Mifos X Core Banking - Takashimaya Bank (TKB) Edu Simulator

Hệ thống web mô phỏng giáo dục trực quan 100% chuẩn giao diện **Mifos Community App**, phục vụ học tập và thuyết trình các bài tập thiết lập phân hệ Core Banking mà **không cần cài máy ảo, Docker hay PostgreSQL nặng nề**.

---

## 📌 Cam kết tính xác thực & Không bịa tính năng
Toàn bộ dữ liệu trong ứng dụng được trích xuất trực tiếp 100% từ file sao lưu cơ sở dữ liệu thật của bạn:
* File nguồn: `mifos_full_backup_15102026_Final_Edu.sql`
* Tên tổ chức tài chính: **Takashimaya Bank (TKB)**
* Tổng số thao tác audit log phân hệ được trích xuất: **453 lệnh**

---

## 🏛️ 6 Phân Hệ Thiết Lập Có Trong Web Mô Phỏng

### 1. Phân hệ Cơ cấu Tổ chức & Quản lý Tiền mặt (Organization & Cash Management)
* **30 Văn phòng (Offices)** theo mô hình 4 cấp:
  * Hội sở chính: `Takashimaya Bank (TKB) - HO` (Mã: `TKB - HO - 001`).
  * 3 Vùng: Miền Bắc (`TKB-REG-NOR`), Miền Trung (`TKB-REG-CEN`), Miền Nam (`TKB-REG-SOU`).
  * Các Chi nhánh (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng...) và các Phòng giao dịch (Thu Duc TO, Thuan Hoa TO...).
  * Có sẵn cả 2 chế độ: **Bảng danh sách** và **Cây phân cấp (Tree Hierarchy)**.
* **Quản lý Tiền mặt (Tellers & Cashiers)**:
  * Bàn thu ngân `Thu Duc Teller 01` (PGD Thủ Đức, hiệu lực từ `2026-08-05`).
  * Phân bổ nhân sự Cashier toàn thời gian (Full Day).
  * Chức năng **Cấp tiền mặt đầu ngày (Allocate Cash)** và theo dõi hạn mức quỹ.

### 2. Phân hệ Người dùng & Phân quyền Maker - Checker (Users, Roles & Dual Control)
* **27 Tài khoản nhân sự thật**: Phân bổ theo chi nhánh và phòng ban nghiệp vụ.
* **16 Vai trò chuyên biệt**:
  * Maker: `TKB_ACCOUNTING_MAKER`, `TKB_LOAN_OFFICER`, `TKB_SAVINGS_OFFICER`, `TKB_CUSTOMER_SERVICE`...
  * Checker/Approver: `TKB_ACCOUNTING_CHECKER`, `TKB_LOAN_APPROVER`, `TKB_SAVINGS_SUPERVISOR`, `TKB_CASH_SUPERVISOR`...
  * Quản trị: `Super user`, `TKB_USER_ADMIN`...
* **Công cụ Đổi User tức thì**: Cho phép chuyển đổi linh hoạt giữa các tài khoản ngay trên thanh Header để trình diễn nguyên tắc kiểm soát 4 mắt (Maker lập hồ sơ, Checker đăng nhập duyệt hồ sơ).

### 3. Phân hệ Kế toán & Sổ cái (Accounting, COA & GL Rules)
* **70 Tài khoản kế toán GL**: Chuẩn 5 nhóm (1-Asset, 2-Liability, 3-Equity, 4-Income, 5-Expense) với phân định rõ tài khoản Header (tổng hợp) và Detail (được phép hạch toán).
* **6 Financial Activity Mappings**: Ánh xạ quỹ tiền mặt tại két chính (110101), tiền mặt tại quầy (110102), tiền chuyển tiếp (110201/110202), số dư đầu kỳ (310001)...
* **Quy tắc kế toán (Accounting Rules)**: Bút toán trích trước chi phí quản lý vận hành `Operating Expense Accrual` (Nợ 530101, Có 220101).
* **Khóa sổ kế toán (GL Closure)**: Ghi nhận chốt sổ tháng 08/2026 tại Hội sở.
* **Sổ nhật ký (Search Journal Entries)**: Xem lại 75 bút toán kế toán tự động phát sinh từ các nghiệp vụ thực tế.

### 4. Phân hệ Sản phẩm Tín dụng & Tiền gửi (Products Management)
* **Sản phẩm Cho vay**: `TKB Personal Loan` (`TKPL`):
  * Số tiền gốc: 10.000.000 VND.
  * Kỳ hạn: 12 kỳ (trả hàng tháng).
  * Lãi suất: 12%/năm (Flat).
  * Tích hợp hạch toán kế toán đầy đủ: Nợ gốc (120101), Thu lãi (410001), Quỹ giải ngân (110102).
* **3 Sản phẩm Tiền gửi & Tiết kiệm**:
  * `TKB Current Account` (`TKCA`): Tiền gửi thanh toán không kỳ hạn.
  * `TKB Fixed Deposit` (`TKFD`): Tiết kiệm có kỳ hạn 6 tháng, lãi suất 6.5%/năm.
  * `TKB Goal Savings` (`TKGS`): Tiết kiệm gửi góp định kỳ tích lũy mục tiêu.

### 5. Phân hệ Khách hàng & Mã định danh CIF (Client Onboarding)
* **12 Khách hàng mẫu**:
  * 10 Khách hàng tại Hội sở (`TKB-CUS-001` đến `TKB-CUS-010`).
  * 2 Khách hàng VIP tại PGD Thủ Đức: `Minh Quang Tran` (`TKB-CIF-TDU-001`) và `Lan Ngoc Pham` (`TKB-CIF-TDU-002`).
* **Hồ sơ 360° khách hàng**: Xem thông tin định danh, danh sách khoản vay, danh sách sổ tiết kiệm, nút thao tác nhanh `+ New Loan`, `+ New Savings`.

### 6. Phân hệ Vận hành Tín dụng & Tiền gửi (Core Banking Operations)
* **Nghiệp vụ Cho vay**:
  * Hồ sơ khoản vay `#000000001` (Khách hàng: Minh Quang Tran, 10.000.000 VND).
  * Trạng thái: Active (Đã giải ngân).
  * Lịch trả nợ gốc/lãi 12 kỳ chi tiết.
  * Nút **Make Repayment (Thu nợ)**: Thực hiện thu nợ từng kỳ, tự động cập nhật dư nợ gốc và tổng nợ đã thu.
* **Nghiệp vụ Tiết kiệm**:
  * Các tài khoản thanh toán và sổ tiết kiệm có kỳ hạn.
  * Nút **Deposit (Nộp tiền)** và **Withdrawal (Rút tiền)** với cập nhật số dư tức thì.

---

## 🎓 Sổ Tay Hướng Dẫn Giáo Dục (Edu Guide Drawer)
Ngay trên thanh điều hướng trên cùng, bấm vào nút **"Sổ Tay Bài Tập (6 Phân hệ)"**:
* Mỗi phân hệ có mục tiêu nghiệp vụ, dữ liệu bài tập chuẩn, quy trình từng bước (checklist), nút **"👉 Dẫn đường đến màn hình phân hệ này"** và các lưu ý chấm điểm của giảng viên.

---

## 🚀 Cách Khởi Động Web

### Cách 1: Click chạy file .bat (Dành cho Windows)
Chỉ cần nhấp đúp vào file [`chay_web_edu.bat`](file:///c:/Users/kirat/Desktop/Mifos%20Sandbox%20for%20Edu/chay_web_edu.bat).

### Cách 2: Chạy lệnh terminal
```bash
npm run dev
```
Sau đó mở trình duyệt tại: **http://localhost:3000**
