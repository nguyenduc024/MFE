# HE THONG QUY CHUAN THIET KE GIAO DIEN VA TRAI NGHIEM NGUOI DUNG (UI/UX DESIGN SYSTEM)
# DU AN: MIFOS X CORE BANKING - TAKASHIMAYA BANK (TKB) EDU SIMULATOR

Tai lieu nay quy dinh toan bo tieu chuan ve thiet ke (Design), bo cuc (Layout), cac duong dan dieu huong (Links/Routing), thanh phan giao dien (Components) va co che luong thuc hanh (Guided Practice Tour) cho he thong Mifos Sandbox for Edu. Moi lap trinh vien hoac AI tiep nhan du an phai doc va tuan thu nghiem ngat tai lieu nay, khong tu y sang tao sai lech quy chuan.

---

## 1. NGUYEN TAC THIET KE COT LOI (CORE DESIGN PRINCIPLES)

1. Tuan thu nguyen ban Mifos Community App:
   Giao dien phai mo phong chinh xac 100% phan mem ngan hang loi Mifos X / Apache Fineract Community App. Khong lam giao dien theo phong cach web hien dai bong bay, gradient qua muc, hoac bo goc tron vuot muc (rounded-2xl, rounded-3xl).

2. Quy tac Do sac net Doanh nghiep (Enterprise Sharp Corners):
   Tat ca cac the, khung, nut bam, modal va input deu dung bo goc toi thieu: rounded-[2px] hoac rounded-[3px]. Khong dung rounded-lg, rounded-xl hay rounded-full (tru cac huy hieu badge tron danh so thu tu).

3. Quy tac nghiem ngat ve Icon va Emoji:
   TUYET DOI KHONG DUNG ICON HOAC EMOJI trong noi dung huong dan, bang thong so doi chieu, popup thong bao, hop nhap du lieu mau, the tooltip cua tour thuc hanh. Tat ca phai duoc trinh bay duoi dang van ban thuan tuy (pure text), ngan gon, ro rang va mang tinh chat giao duc he thong.

4. To chuc du lieu xac thuc:
   Toan bo du lieu nghiep vu (tai khoan GL, don vi tien te, van phong, vai tro, san pham) deu truyen theo du lieu sao luu thuc te tu he thong Mifos X. Khong tu dat ten ma GL hoac quy trinh gia dinh.

---

## 2. BANG MA MAU CHUAN (COLOR PALETTE)

| Thanh phan / Muc dich | Ma mau Hex / Tailwind | Giai thich su dung |
| :--- | :--- | :--- |
| Primary Blue (Xanh chu dao Mifos) | #1072ba | Thanh dieu huong tren cung, nut bam chinh, tieu de quan trong, vien spotlight |
| Dark Primary Blue (Xanh dam hover) | #0e619e | Trang thai Hover cua nut bam, phan chon phan he trong So tay |
| Background Trang | #ffffff | Nen trang noi dung, nen the card, nen bang |
| Background Xam nhat | #f8f9fa / bg-gray-50 | Nen phan body he thong, nen the thong tin, the tooltip |
| Text Den chu dao | #212529 / text-gray-900 | Tieu de trang, ten tai khoan, du lieu trong bang |
| Text Xam phu | #6c757d / text-gray-600 | Mo ta phu, nhan chu thich, huong dan thao tac |
| Border Xam tieu chuan | #dee2e6 / border-gray-200 | Duong ke phan chia bang, vien input, vien the card |
| Success Green (Xanh la hoan thanh) | #28a745 / hover: #218838 | Nut "Hoan thanh phan thuc hanh", badge trang thai dat, thanh tien do 100% |
| Success Tint | bg-emerald-50, border-emerald-200 | Hop thong bao hoan tat xuat sac, tien do hoan thanh |
| Sky Accent Tint | bg-sky-50, border-sky-200 | Hop nhap du lieu mau, the goi y huong dan |
| Warning Orange | #fd7e14 / bg-amber-50 | Canh bao tai khoan, trang thai cho duyet |
| Danger Red | #dc3545 / text-red-600 | Nut huy, xoa, trang thai loi, danh dau chua dat |

---

## 3. TYPOGRAPHY (FONT CHU VA QUY CACH CHU)

- Font family: font-sans (Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif).
- Tieu de trang (Page Heading): text-xl font-normal text-[#212529].
- Duong dan Breadcrumb: text-xs text-gray-500 font-normal, co dau gach doc "|" ngan cach voi tieu de trang va dau "/" ngan cach cac cap thu muc.
- Tieu de the / Khung (Section Header): text-xs font-bold uppercase tracking-wider text-gray-900.
- Van ban thong thuong (Body Text): text-xs leading-relaxed text-gray-700.
- Chu thich / Metadata: text-[11px] hoac text-[10px] text-gray-500.
- Ma so he thong (GL Code, Office External ID, Role Code): font-mono font-bold text-gray-900.

---

## 4. BO CUC GIAO DIEN TONG THE (LAYOUT STRUCTURE)

Moi man hinh trong ung dung deu tuan theo cau truc bo cuc phan tang kien truc sau:

### 4.1. Thanh Header tren cung (Top Navigation Bar)
- Chieu cao: h-12 (48px), co dinh (fixed top-0 left-0 right-0), z-40.
- Mau nen: #1072ba (Primary Blue).
- Cac thanh phan tu trai qua phai:
  1. Logo / Thuong hieu: Takashimaya Bank Sandbox (text-sm font-bold text-white).
  2. Menu chinh: Home, Clients, Accounting, Admin (cac the bam chu trang, hover sang nen dam hon).
  3. Nut So Tay Bai Tap: Nut mau trang chu xanh #1072ba, giup mo ngan keo So tay huong dan giao duc (EduGuideDrawer).
  4. Chuyen doi User (Maker/Checker Switcher): Dropdown chon nhanh tai khoan nhan vien dang dang nhap de thuc hien kiem soat 4 mat.

### 4.2. Thanh Dieu huong phu (Sub-navigation Bar - neu co)
- Chieu cao: h-9 (36px), nen xam rat nhat border-b border-gray-200.
- Chua cac the tab nghiep vu con (vi du: trong Accounting gom Chart of Accounts, Financial Activity Mappings, Accounting Rules, Closing Entries, Search Journal Entries).

### 4.3. Vung Noi dung chinh (Main Content Area)
- Chieu rong toi da: max-w-5xl mx-auto px-6 py-6.
- Khoang cach tren: padding-top bu tru 48px cua Header co dinh (pt-12).
- Nen tong the: bg-[#f4f5f7] hoac bg-white tuy tung phan he.

### 4.4. Tieu de trang va Breadcrumb chuan
Moi man hinh nghiep vu phai bat dau bang hang tieu de chuan:
```html
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-2.5">
    <h1 className="text-xl font-normal text-[#212529]">Ten Trang Nghiep Vu</h1>
    <span className="text-gray-300 font-light text-base">|</span>
    <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
      <span onClick={() => navigate('home')} className="text-[#1072ba] hover:underline cursor-pointer">Home</span>
      <span className="text-gray-400">/</span>
      <span onClick={() => navigate('accounting')} className="text-[#1072ba] hover:underline cursor-pointer">Accounting</span>
      <span className="text-gray-400">/</span>
      <span className="text-gray-500">Ten Man Hinh Hien Tai</span>
    </div>
  </div>
  <!-- Nut hanh dong goc phai: Nut xanh + Action -->
  <button type="button" className="px-3 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer">
    + Ten Thao Tac
  </button>
</div>
```

---

## 5. HE THONG CAC LINK VA LUONG DIEU HUONG (ROUTING & NAVIGATION)

Toan bo he thong dieu huong duoc quan ly tap trung bang bien trang thai `currentPath` trong `src/App.jsx`. Ham `navigate(path)` nhan tham so chuoi de chuyen trang.

### 5.1. Danh muc duong dan (Route Keys)
| Route Key | Ten Man Hinh | Breadcrumb Path | Muc dich nghiep vu |
| :--- | :--- | :--- | :--- |
| home | Dashboard Overview | Home | Tong quan he thong, so lieu nhanh |
| admin | Admin Dashboard | Admin | Bang chon phan he quan tri |
| admin-organization | Organization Management | Admin / Organization | Chon Offices, Currency, Tellers |
| admin-system | System Management | Admin / System | Chon Roles and Permissions |
| admin-offices | Manage Offices | Admin / Organization / Manage Offices | Danh sach va cay phan cap 30 van phong |
| admin-create-office | Create Office | Admin / Organization / Manage Offices / Create Office | Form tao moi van phong |
| admin-currency-config | Currency Configuration | Admin / Organization / Currency Configuration | Danh sach 5 don vi tien te hoat dong |
| admin-manage-currencies | Manage Currencies | Admin / Organization / Currency Configuration / Add-Edit | Form them/sua dong tien |
| admin-tellers | Cash Management | Admin / Organization / Cash Management | Quan ly ban thu ngan va cap quy |
| admin-users | Manage Users | Admin / Users / Manage Users | Danh sach 27 nhan su |
| admin-create-user | Create User | Admin / Users / Create User | Form tao moi nhan vien |
| admin-user-detail | User Detail Profile | Admin / Users / [User ID] | Chi tiet phan quyen nhan vien |
| admin-roles | Roles and Permissions | Admin / System / Roles and Permissions | Danh sach 16 vai tro |
| admin-add-role | Add Role | Admin / System / Roles and Permissions / Add | Form tao moi vai tro |
| admin-configurations | Global Configurations | Admin / System / Configurations | Bang danh sach cau hinh he thong (maker-checker, contra-account...) |
| admin-loan-products | Loan Products | Admin / Products / Loan Products | Danh muc san pham cho vay |
| admin-savings-products | Savings Products | Admin / Products / Savings Products | Danh muc san pham tien gui |
| accounting | Accounting Dashboard | Accounting | Bang cac nghiep vu ke toan |
| accounting-coa | Chart of Accounts | Accounting / Chart of Accounts | Cay tai khoan GL, tao GL Account |
| accounting-activities | Financial Activity Mappings | Accounting / Financial Activity Mappings | Danh sach 6 lien ket, form Define Mapping |
| accounting-opening-balances | Migrate Opening Balances (Office-wise) | Accounting / Migrate Opening Balances | Chuyen so du dau ky theo van phong, tinh tong No/Co 48 tai khoan |
| accounting-rules | Accounting Rules | Accounting / Accounting Rules | Quy tac trich truoc chi phi van hanh |
| accounting-closure | Closing Entries | Accounting / Closing Entries | Khoa so ke toan cuoi ky |
| accounting-journal | Search Journal Entries | Accounting / Search Journal Entries | Tra cuu 75 but toan nhat ky chung |
| clients | Clients List | Clients | Danh sach 12 khach hang |
| client-detail | Client 360 Profile | Clients / [Client Name] | Ho so khach hang, danh sach khoan vay |
| loan-detail | Loan Detail & Repayment | Clients / Client / Loan #[AccountNo] | Thu no goc/lai, lich tra no |
| savings-detail | Savings Detail | Clients / Client / Savings #[AccountNo] | Gui tien, rut tien, tinh lai |

### 5.2. Chuyen che do xem noi bo (Internal View Modes)
Moi man hinh co the quan ly che do xem bang state `viewMode`:
- `viewMode === 'list'`: Hien thi danh sach hoac cay phan cap.
- `viewMode === 'create'` hoac `'edit'`: Hien thi bieu mau tao moi hoac chinh sua ngay trong cung component ma khong lam mat bo nho trang thai ung dung.

---

## 6. QUY CHUAN THANH PHAN GIAO DIEN (UI COMPONENTS SPECIFICATION)

### 6.1. Bieu mau nhap lieu (Forms & Inputs)
- The bao boc bieu mau: bg-white border border-gray-200 rounded-[2px] p-6 shadow-xs space-y-4.
- Nhan truong (Field Labels): text-xs font-semibold text-gray-700. Truong bat buoc phai co dau sao do: `<span className="text-red-500">*</span>`.
- O nhap chu / so (Text Inputs):
  `w-full px-3 py-1.5 text-xs border border-gray-300 rounded-[2px] focus:outline-none focus:border-[#1072ba] focus:ring-1 focus:ring-[#1072ba]`
- Hop chon tha xuong (Dropdown Select):
  Co the dropdown custom de phuc vu viec lua chon truc quan hoac select chuan co vien mau xam, mui ten tam giac nho, chu ro rang.
- O chon Checkbox:
  `w-3.5 h-3.5 text-[#1072ba] border-gray-300 rounded-[2px] focus:ring-[#1072ba]`
- Hang nut cuoi form (Form Actions):
  Dat o goc duoi hoac can le trai phu hop Mifos:
  Nut Cancel: `px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px]`
  Nut Submit: `px-4 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs`

### 6.2. Bang du lieu (Data Tables)
- Khung ngoai: border border-gray-200 rounded-[2px] overflow-hidden bg-white.
- Hang tieu de bang (Table Header):
  `thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-700 font-semibold text-xs"`
  Moi cot co `py-2.5 px-4 text-left`.
- Than bang (Table Body):
  `tbody className="divide-y divide-gray-100 text-xs text-gray-800"`
  Moi dong co `hover:bg-sky-50/40 transition-colors`.
- Cot trang thai / Huy hieu (Status Badges):
  Chon mau sac phan biet ro rang theo loai:
  - ASSET: bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-[2px] text-[10px]
  - LIABILITY: bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-[2px] text-[10px]
  - EQUITY: bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-[2px] text-[10px]
  - INCOME: bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-[2px] text-[10px]
  - EXPENSE: bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-[2px] text-[10px]
  - HEADER: bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded-[2px] text-[10px]
  - DETAIL: bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-[2px] text-[10px]

### 6.3. Thanh phan trang (Table Pagination)
- Vi tri: Duoi day moi bang danh sach.
- Giao dien:
  `px-4 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-500`
  - Ben trai: Dropdown "Items per page: 15".
  - Ben phai: "1 - N of N" va cac nut dieu huong trang (Dau trang, Lui, Tien, Cuoi trang).

---

## 7. KIEN TRUC SO TAY BAI HOC (EDUGUIDEDRAWER)

Component: `src/components/EduGuideDrawer.jsx`
Muc dich: Cung cap so tay giao trinh huong dan sinh vien / giang vien theo tung phan he ma khong lam che khuat toan bo man hinh.

### 7.1. Bo cuc Drawer
- Chieu rong: fixed right-0 top-12 bottom-0 w-full sm:w-[480px] md:w-[500px] bg-white shadow-xl z-50 flex flex-col.
- Header Drawer: Mau xanh #1072ba, chu trang, tieu de: "So Tay Bai Hoc Phan He Core Banking", nut Dong.
- Module Selector Dropdown:
  Nut bam mau trang tha xuong toan bo danh sach cac bai hoc thuoc:
  - Phan he 01: Accounting / GL (Phan 1, Phan 2, Phan 3, Phan 4, Phan 5).
  - Foundation Setup: Thiet Lap Nen Tang (Foundation 1: User & Roles, Foundation 2: Co Cau To Chuc).
  Moi muc hien thi ten bai hoc, mo ta ngan va phan tram tien do thuc te (0% - 100%).

### 7.2. Noi dung tung bai hoc
Moi bai hoc gom 5 khoi tieu chuan:
1. Thong tin phan he: Tieu de bai hoc, muc tieu nghiep vu.
2. Hop do luong tien do (Progress Tracker):
   Hien thi thanh tien do %, so luong da hoan thanh tren tong so (vi du: 6/6 lien ket), kem nut "Thiet lap lai tu dau" de xoa sach du lieu phuc vu luyen tap lai.
3. Danh sach doi tuong can tao:
   Danh sach kiem tra (checklist) co danh so thu tu thuan tuy `[1]`, `[2]`, `[3]`... kem trang thai "Da tao / Da lien ket" (chu xanh la) hoac "Chua tao / Chua lien ket" (chu xam).
4. Quy trinh thao tac chuan (Workflow Steps):
   Tung buoc thao tac duoc danh so hinh tron mau xanh #1072ba (vi du: 1, 2, 3, 4), mo ta chinh xac can bam vao dau, chon muc gi, dien thong tin gi.
5. Bang doi chieu thong so mau (Reference Data Table):
   Bang trinh bay thuan van ban (pure text) toan bo gia tri du lieu chuan cua bai tap.

### 7.3. Footer Drawer (Action Buttons)
- Khi tien do chua dat 100%:
  Nut mau xanh #1072ba: `Bắt đầu thực hành [Tên bài học]`.
  Khi bam: Tu dong reset danh sach ve rong, dieu huong ve trang home, kich hoat tour thuc hanh `PracticeSpotlightTour`.
- Khi tien do dat 100%:
  - Hop thong bao mau xanh la: "Da hoan thanh xuat sac bai hoc (100%)!".
  - Nut chuyen sang bai hoc tiep theo: `Đến bài học kế tiếp: [Tên bài học sau] →` (mau xanh la #28a745).
  - Nut luyen tap lai: `Luyện tập lại [Tên bài học]` (mau sky nhe bg-sky-50 text-[#1072ba]).

---

## 8. KIEN TRUC LUONG THUC HANH CHIEU SANG (PRACTICE SPOTLIGHT TOUR)

Component: `src/components/PracticeSpotlightTour.jsx`
Muc dich: Huong dan nguoi hoc tuong tac truc tiep tung buoc tren giao dien bang cach lam toi toan bo man hinh va chieu sang dung thanh phan can thao tac.

### 8.1. Co che Spotlight Mask (Mat na cat sang bang SVG)
- Toan man hinh duoc phu lop toi: `fill="rgba(0, 0, 0, 0.72)"`.
- Vung can thao tac duoc cat sang qua `<mask id="practice-spotlight-mask">` voi hinh chu nhat `fill="black"`.
- 4 khoi chan chuot vo hinh (click-blockers) xung quanh vung sang de ngan nguoi dung bam nham ra ngoai vung huong dan.
- Vung sang co vien phat sang chuyen dong nhe: `border-2 border-[#1072ba] ring-4 ring-[#1072ba]/40 animate-pulse`.

### 8.2. QUY TAC VI TRI THE TOOLTIP (TOOLTIP POSITIONING RULES)
Day la quy tac dac biet quan trong de khong lam che khuat noi dung thuc hanh:

1. Doi voi cac bieu mau nhap lieu lon (vi du: `#tour-gl-create-card`, `#tour-mapping-create-card`):
   THE TOOLTIP PHAI DAT O BEN TRAI O SANG (LEFT POSITIONING):
   ```javascript
   if (targetSelector === '#tour-gl-create-card' || targetSelector === '#tour-mapping-create-card') {
     const tooltipWidth = 330;
     const tooltipLeft = Math.max(16, box.left - tooltipWidth - 20);
     const tooltipTop = Math.max(16, Math.min(box.top, windowHeight - 460));
     tooltipStyle = {
       position: 'fixed',
       top: `${tooltipTop}px`,
       left: `${tooltipLeft}px`,
       width: `${tooltipWidth}px`
     };
   }
   ```
   Khong bao gio dat the tooltip de len tren bieu mau dang chieu sang.

2. Doi voi cac nut bam nho hoac o chon tren thanh dieu huong:
   Tooltip duoc tinh toan tu dong dat o phia duoi (`box.bottom + 12px`) hoac phia tren neu sat mep duoi man hinh.

### 8.3. The Huong dan Tooltip (Tooltip Instruction Card)
- Header the: Dong chu nho `CHE DO THUC HANH CO HUONG DAN` (mau xanh #1072ba) va nut `Thoat thuc hanh`.
- Tieu de buoc: `Buoc X / Y: Ten thao tac cu the`.
- Chi dan buoc: Van ban giai thich ngan gon hanh dong can lam.
- Hop goi y nhap du lieu mau (Quick Autofill Card) tai buoc nhap lieu:
  - Khung mau xam trang nhe bg-slate-50 border-slate-300 rounded-[2px].
  - Liet ke day du cac gia tri can nhap duoi dang text thuan tuy (Account Type, Code, Name, Parent, Usage...).
  - Nut bam: `Nhập dữ liệu mẫu ([Tên đối tượng])`.
  - Co che hoat dong: Dispatch mot CustomEvent toi window (vi du: `practice-autofill-gl`, `practice-autofill-activity-mapping`), view component lang nghe su kien va tu dong dien du lieu vao form.

### 8.4. Cac Hop Thoai Thong Bao (Pop-up Modals)
1. Thong bao sau moi buoc tao thanh cong (vi du: tao 1 trong 5 GL Header, 1 trong 6 lien ket):
   - Hien thi modal nhe giua man hinh.
   - Dong tieu de: `Tien do: X/Y doi tuong`.
   - Noi dung: Xac nhan da luu thanh cong doi tuong vua tao.
   - Thao tac tiep theo: Ghi ro doi tuong ke tiep can tao la gi.
   - Nut hanh dong: `Tiep tuc tao [doi tuong] tiep theo`.
2. Thong bao hoan tat toan bo danh sach mau:
   - Hien thi bang tong ket danh sach tat ca cac doi tuong da tao.
   - Co 2 lua chon:
     a) `Nhap toan bo danh sach vao database` (neu bai tap co danh sach lon nhu 54 GL Details hoac 11 GL Level 2).
     b) `Hoan thanh phan thuc hanh` (nut mau xanh la #28a745, nhan manh ket thuc tour thanh cong).

### 8.5. YEU CAU BAT BUOC VE NUT HOAN THANH (COMPLETION BUTTON REQUIREMENT)
- O buoc cuoi cung cua moi tour thuc hanh, khi nguoi dung da tao du so luong mau quy dinh:
  BAT BUOC PHAI CO NUT MAU XANH LA CAY: `Hoàn thành phần thực hành`
- Nut nay duoc bo tri ca o trong Tooltip Card goc man hinh va trong Hop thoai Modal tong ket.
- Khi user nhan vao nut nay: Dong tour thuc hanh (`onClose()`) va dieu huong den man hinh danh sach tuong ung de user chiem nguong thanh qua.
- Nguoi dung KHONG PHAI bam nut "Thoat thuc hanh" de ket thuc bai hoc.

---

## 9. QUY TRINH CAC BUOC KHI THIET KE PHAN HE / BAI HOC MOI

Moi khi can bo sung mot phan he moi hoac bai hoc moi vao he thong, phai thuc hien theo dung 6 buoc sau:

### Buoc 1: Dinh nghia Du lieu goc trong `src/data/mifosData.js`
- Khai bao mang du lieu khoi tao (vi du: `INITIAL_LOAN_PRODUCTS`, `INITIAL_ACCOUNTING_RULES`...).
- Them bai hoc vao mang `EDU_MODULES`:
  ```javascript
  {
    id: "module-part-id",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Loan Products",
    partNumber: "1",
    name: "Phần 1: Cấu hình Sản phẩm Tín dụng",
    shortLabel: "Phần 1: Loan Products",
    title: "Thiết Lập Sản Phẩm Tín Dụng Cá Nhân",
    objective: "Mục tiêu cụ thể của bài thực hành...",
    targetMenu: "admin-loan-products",
    subPath: "products"
  }
  ```

### Buoc 2: Xay dung Man hinh nghiep vu (View Component)
- Tao file trong `src/views/` (vi du: `LoanProductView.jsx`).
- Su dung bo cuc chuan tieu de, breadcrumbs, nut hanh dong + Add.
- Co 2 che do `viewMode === 'list'` va `viewMode === 'create'`.
- Gan cac thuoc tinh ID ro rang cho tour spotlight:
  - Nut them moi: `id="tour-btn-add-loan-product"`
  - Khung form: `id="tour-loan-product-create-card"`
  - Nut submit: `id="tour-submit-loan-product-btn"`
- Lang nghe CustomEvent `practice-autofill-[ten-nghiep-vu]` de ho tro chuc nang dien nhanh mau.

### Buoc 3: Khai bao Route va State trong `src/App.jsx`
- Them state luu tru mang du lieu nghiep vu.
- Them duong dan trong ham `getBreadcrumbs()`.
- Them render view tuong ung voi `currentPath`.
- Them nhanh xu ly reset du lieu trong `onStartPractice`.
- Truyen state va ham xu ly xuong `EduGuideDrawer` va `PracticeSpotlightTour`.

### Buoc 4: Cap nhat So tay huong dan trong `src/components/EduGuideDrawer.jsx`
- Nhan state du lieu va ham reset qua props.
- Viet ham tinh toan tien do `calculate[TenBaiHoc]Progress()`.
- Cap nhat Module Selector dropdown de hien thi tien do % thuc te.
- Viet khoi render `{activePartId === 'module-part-id' && (...)}`:
  - Thong tin bai hoc, muc tieu.
  - Hop do tien do kem nut reset du lieu ve ban dau.
  - Checklist danh sach can tao.
  - 4 buoc thao tac chuan.
  - Bang doi chieu thong so mau (van ban thuan tuy, khong icon).
- Cap nhat footer button: Nut bat dau thuc hanh, nut luyen tap lai, va nut chuyen den bai hoc tiep theo.

### Buoc 5: Tich hop Luong thuc hanh trong `src/components/PracticeSpotlightTour.jsx`
- Nhan du lieu va ham nap du lieu qua props.
- Khai bao state popup quan ly tien do bai hoc.
- Them co che theo doi (tracking useEffect) khi co ban ghi moi duoc submit thanh cong.
- Xac dinh cac buoc step va targetSelector tuong ung (tu Buoc 1 den Buoc hoan thanh).
- Dam bao quy tac dat vi tri tooltip o ben trai khung nhap lieu lon.
- Trinh bay hop du lieu mau bang text thuan tuy (khong dung icon).
- Bo tri day du nut `Hoàn thành phần thực hành` (mau xanh la #28a745) o buoc cuoi cung.

### Buoc 6: Kiem thu va Build xac thuc
- Chay `npm run build` tren terminal de dam bao 0 loi cu phap, 0 loi dong ngoac hoac thieu bien.
- Thao tac truc tiep tren trinh duyet tu dau den cuoi de xac nhan luong hoat dong tron tru.

---

## 10. BANG THAM CHIEU CAC EVENT VA TOUR ID HIEN CO

| Phan he / Bai hoc | Tour IDs quan trong | Custom Autofill Event | Ham nap toan bo database |
| :--- | :--- | :--- | :--- |
| Foundation 1: Roles & Users | #tour-nav-admin, #tour-admin-system, #tour-roles-tile, #tour-btn-add-role, #tour-role-create-card, #tour-submit-role-btn, #tour-users-tile, #tour-btn-add-user, #tour-user-create-card, #tour-submit-user-btn | practice-autofill-role, practice-autofill-user | onLoadAllRoles, onLoadAllUsers |
| Foundation 2: Offices | #tour-admin-organization, #tour-offices-tile, #tour-btn-add-office, #tour-office-input-card, #tour-submit-office-btn | practice-autofill-office | onLoadAllOffices, onLoadRegionalOffices |
| GL Part 1: Currencies | #tour-currency-config, #tour-btn-add-edit-currency, #tour-search-currency-area, #tour-btn-add-currency, #tour-submit-currencies-btn | practice-autofill-currency | onLoadAllCurrencies |
| GL Part 2: 5 Root GL Headers | #tour-nav-accounting, #tour-coa-tile, #tour-btn-add-account, #tour-gl-create-card, #tour-submit-gl-btn | practice-autofill-gl | Co san trong cay tai khoan |
| GL Part 3: 11 GL Level 2 | #tour-nav-accounting, #tour-coa-tile, #tour-btn-add-account, #tour-gl-create-card, #tour-submit-gl-btn | practice-autofill-gl | onLoadAllGlLevel2 |
| GL Part 4: 54 GL Details | #tour-nav-accounting, #tour-coa-tile, #tour-btn-add-account, #tour-gl-create-card, #tour-submit-gl-btn | practice-autofill-gl | onLoadAllGlDetails |
| GL Part 5: 6 Financial Activity Mappings | #tour-nav-accounting, #tour-financial-activities-tile, #tour-btn-define-mapping, #tour-mapping-create-card, #tour-submit-mapping-btn | practice-autofill-activity-mapping | onLoadAllFinancialActivities |

---
Tai lieu duoc cap nhat vao ngay: 19/10/2026. Tuan thu day du quy chuan phan mem giao duc Mifos X Sandbox for Edu.
