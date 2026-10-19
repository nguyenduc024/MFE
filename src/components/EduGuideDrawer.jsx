import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { EDU_MODULES } from '../data/mifosData';

export default function EduGuideDrawer({ 
  isOpen, 
  onClose, 
  navigate, 
  onStartPractice,
  roles = [],
  users = [],
  offices = [],
  currencies = [],
  glAccounts = [],
  financialActivities = [],
  onResetCurrencies,
  onResetGlHeaders,
  onResetGlLevel2,
  onResetGlDetails,
  onResetFinancialActivities,
  contraAccountConfigEnabled = false,
  hasOpeningBalanceSubmitted = false,
  onResetOpeningBalances,
  customJournalEntries = [],
  onResetManualJournal,
  accountingRules = [],
  onResetAccountingRules,
  onResetFrequentPostings
}) {
  const [activePartId, setActivePartId] = useState('part-1');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

  if (!isOpen) return null;

  // Tính toán tiến độ Phân hệ 01 - Phần 1: Thiết Lập Đơn Vị Tiền Tệ (4 mốc x 25% = 100%)
  const calculateGlPart1Progress = () => {
    let score = 0;
    if (currencies.length > 0) score += 25;
    const hasVnd = currencies.some(c => c.code === 'VND');
    if (hasVnd) score += 25;
    if (currencies.length >= 3) score += 25;
    if (currencies.length >= 5) score += 25;
    return score;
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 2: Thiết Lập 5 Header Cấp 1 (5 mốc x 20% = 100%)
  const calculateGlPart2Progress = () => {
    const rootCodes = ['100000', '200000', '300000', '400000', '500000'];
    const matched = rootCodes.filter(code => 
      glAccounts.some(a => a.glCode === code && (a.usage || '').toLowerCase() === 'header')
    );
    return matched.length * 20;
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 3: Thiết Lập GL Cấp 2 (11 tài khoản = 100%)
  const calculateGlPart3Progress = () => {
    const allLevel2Codes = ['110000', '120000', '130000', '210000', '220000', '310000', '410000', '420000', '510000', '520000', '530000'];
    const matched = allLevel2Codes.filter(code => 
      glAccounts.some(a => a.glCode === code && (a.usage || '').toLowerCase() === 'header')
    );
    return Math.round((matched.length / allLevel2Codes.length) * 100);
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 4: Thiết Lập GL Chi Tiết (54 tài khoản = 100%)
  const calculateGlPart4Progress = () => {
    const totalDetails = 54;
    const detailCount = glAccounts.filter(a => (a.usage || '').toLowerCase() === 'detail').length;
    return Math.min(100, Math.round((detailCount / totalDetails) * 100));
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 5: Ánh Xạ Hoạt Động Tài Chính (6 liên kết = 100%)
  const calculateGlPart5Progress = () => {
    const requiredCodes = ['300', '101', '102', '103', '100', '200'];
    const matched = requiredCodes.filter(code => 
      financialActivities.some(fa => String(fa.activityCode) === String(code))
    );
    return Math.round((matched.length / requiredCodes.length) * 100);
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 6: Khởi Tạo Số Dư Đầu Kỳ (Opening Balance Migration)
  const calculateGlPart6Progress = () => {
    let score = 0;
    if (contraAccountConfigEnabled) score += 50;
    if (hasOpeningBalanceSubmitted) score += 50;
    return score;
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 7: Ghi Nhận Bút Toán Thủ Công (Manual Journal Entries)
  const calculateGlPart7Progress = () => {
    const hasManualEntry = (customJournalEntries || []).some(
      e => e.referenceNumber === 'TKB-OPEX-202610-001' || String(e.id).includes('OPEX') || e.comments?.includes('OPEX') ||
      (e.debits?.some(d => d.glCode === '530101') && e.credits?.some(c => c.glCode === '220301'))
    );
    return hasManualEntry ? 100 : 0;
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 8: Thiết Lập Quy Tắc Định Khoản (Accounting Rules)
  const calculateGlPart8Progress = () => {
    const hasRule = (accountingRules || []).some(
      r => r.name === 'Operating Expense Accrual' || r.debitAccount?.includes('Operating Expense') || r.debitAccountId === '530101'
    );
    return hasRule ? 100 : 0;
  };

  // Tính toán tiến độ Phân hệ 01 - Phần 9: Định Khoản Thường Xuyên (Frequent Postings)
  const calculateGlPart9Progress = () => {
    const hasFrequentEntry = (customJournalEntries || []).some(
      e => e.entryType === 'FREQUENT_POSTING' || e.referenceNumber?.includes('TKB-OPEX-202610-002') || e.comments?.includes('IT system maintenance') || e.id === 'a2f68debe1a7'
    );
    return hasFrequentEntry ? 100 : 0;
  };

  // Tính toán tiến độ Foundation 1: User & Access Management (4 mốc x 25% = 100%)
  const calculatePart1Progress = () => {
    let score = 0;
    if (roles.length > 2) score += 25;
    if (roles.length >= 16) score += 25;
    if (users.length > 2) score += 25;
    if (users.length >= 26) score += 25;
    return score;
  };

  // Tính toán tiến độ Foundation 2: Cơ Cấu Tổ Chức (4 mốc x 25% = 100%)
  const calculatePart2Progress = () => {
    let score = 0;
    const hasHO = offices.some(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
    if (hasHO) score += 25;

    const hasRO = offices.some(o => {
      if (!o.parentId || o.parentId === 'none' || o.parentId === 'root') return false;
      const parent = offices.find(p => String(p.id) === String(o.parentId));
      return (parent && (!parent.parentId || parent.parentId === 'none' || parent.parentId === 'root')) ||
        o.name.toLowerCase().includes('region') ||
        o.name.toLowerCase().includes('khu vực');
    });
    if (hasRO) score += 25;

    const hasBranch = offices.some(o => {
      return o.name.toLowerCase().includes('branch') || o.name.toLowerCase().includes('chi nhánh');
    });
    if (hasBranch) score += 25;

    const hasTO = offices.some(o => {
      return o.name.toLowerCase().includes('transaction office') ||
        o.name.toLowerCase().includes('phòng giao dịch') ||
        (o.externalId && o.externalId.toLowerCase().includes('-to-'));
    });
    if (hasTO) score += 25;

    return score;
  };

  const currentModule = EDU_MODULES.find(m => m.id === activePartId) || EDU_MODULES[0];
  const glPart1Progress = calculateGlPart1Progress();
  const glPart2Progress = calculateGlPart2Progress();
  const glPart3Progress = calculateGlPart3Progress();
  const glPart4Progress = calculateGlPart4Progress();
  const glPart5Progress = calculateGlPart5Progress();
  const glPart6Progress = calculateGlPart6Progress();
  const glPart7Progress = calculateGlPart7Progress();
  const part1Progress = calculatePart1Progress();
  const part2Progress = calculatePart2Progress();
  
  const glPart8Progress = calculateGlPart8Progress();
  const glPart9Progress = calculateGlPart9Progress();

  const currentProgress = 
    activePartId === 'gl-part-1' ? glPart1Progress :
    activePartId === 'gl-part-2' ? glPart2Progress :
    activePartId === 'gl-part-3' ? glPart3Progress :
    activePartId === 'gl-part-4' ? glPart4Progress :
    activePartId === 'gl-part-5' ? glPart5Progress :
    activePartId === 'gl-part-6' ? glPart6Progress :
    activePartId === 'gl-part-7' ? glPart7Progress :
    activePartId === 'gl-part-8' ? glPart8Progress :
    activePartId === 'gl-part-9' ? glPart9Progress :
    activePartId === 'part-1' ? part1Progress : part2Progress;

  const isGlPart1Complete = glPart1Progress === 100;
  const isGlPart2Complete = glPart2Progress === 100;
  const isGlPart3Complete = glPart3Progress === 100;
  const isGlPart4Complete = glPart4Progress === 100;
  const isGlPart5Complete = glPart5Progress === 100;
  const isGlPart6Complete = glPart6Progress === 100;
  const isGlPart7Complete = glPart7Progress === 100;
  const isGlPart8Complete = glPart8Progress === 100;
  const isGlPart9Complete = glPart9Progress === 100;
  const isPart1Complete = part1Progress === 100;
  const isPart2Complete = part2Progress === 100;

  return (
    <aside className="fixed right-0 top-12 bottom-0 w-full sm:w-[480px] md:w-[500px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="bg-[#1072ba] text-white px-5 py-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-normal">
            Sổ Tay Bài Học Phân Hệ Core Banking
          </h2>
          <p className="text-[11px] text-sky-200 mt-0.5">
            Takashimaya Bank Sandbox
          </p>
        </div>

        <button 
          onClick={onClose}
          className="text-xs text-white/90 hover:text-white px-2.5 py-1 rounded-[2px] hover:bg-black/10 transition-colors cursor-pointer"
        >
          Đóng
        </button>
      </div>

      {/* Module Selector Dropdown & Thanh đo tiến độ */}
      <div className="bg-[#0e619e] px-5 py-2 flex items-center justify-between gap-3 relative select-none">
        {/* Bên trái: Tên bài học phân hệ (Bấm thả xuống danh sách bài học) */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-white text-[#1072ba] text-xs font-bold hover:bg-sky-50 transition-colors shadow-xs cursor-pointer"
            title="Bấm để xem danh sách bài học"
          >
            <span>{currentModule.shortLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#1072ba] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* List bài học thả xuống khi user bấm vào */}
          {dropdownOpen && (
            <div className="absolute left-0 top-9 w-80 bg-white text-gray-800 rounded-[2px] shadow-xl py-1.5 z-50 text-xs border border-gray-100 animate-in fade-in duration-100">
              {/* Phân hệ 01: Accounting / GL */}
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1072ba] bg-sky-50/70 border-b border-sky-100 mb-1">
                Phân hệ 01: Accounting / GL
              </div>

              {EDU_MODULES.filter(m => m.moduleNumber === "01").map((item) => {
                const isSelected = item.id === activePartId;
                const itemProgress = 
                  item.id === 'gl-part-1' ? glPart1Progress : 
                  item.id === 'gl-part-2' ? glPart2Progress : 
                  item.id === 'gl-part-3' ? glPart3Progress : 
                  item.id === 'gl-part-4' ? glPart4Progress : 
                  item.id === 'gl-part-5' ? glPart5Progress : 
                  item.id === 'gl-part-6' ? glPart6Progress : 
                  item.id === 'gl-part-7' ? glPart7Progress : 
                  item.id === 'gl-part-8' ? glPart8Progress : glPart9Progress;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActivePartId(item.id);
                      setDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50 text-[#1072ba] font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="pr-2 truncate">
                      <div className="text-xs truncate font-medium">{item.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {item.id === 'gl-part-1' ? 'Cấu hình đơn vị tiền tệ VND, USD, JPY...' : 
                         item.id === 'gl-part-2' ? 'Thiết lập 5 tài khoản GL Header cấp 1' :
                         item.id === 'gl-part-3' ? 'Thiết lập 11 tài khoản GL Header cấp 2' :
                         item.id === 'gl-part-4' ? 'Thiết lập 54 tài khoản GL Chi tiết (Detail)' :
                         item.id === 'gl-part-5' ? 'Ánh xạ 6 hoạt động tài chính tự động (Financial Activities)' :
                         item.id === 'gl-part-6' ? 'Khởi tạo số dư đầu kỳ (1 tỷ) & tra cứu Journal Entries' :
                         'Ghi nhận bút toán thủ công (2 triệu OPEX) & tra cứu Journal Entries'}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        itemProgress === 100 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : itemProgress > 0 
                          ? 'bg-sky-100 text-[#1072ba]' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {itemProgress}%
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* User & Access Management (Không phải phân hệ) */}
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1072ba] bg-sky-50/70 border-t border-b border-sky-100 my-1">
                User & Access Management
              </div>

              {EDU_MODULES.filter(m => m.moduleNumber === "user-access" || m.id === "part-1").map((item) => {
                const isSelected = item.id === activePartId;
                const itemProgress = part1Progress;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActivePartId(item.id);
                      setDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50 text-[#1072ba] font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="pr-2 truncate">
                      <div className="text-xs truncate font-medium">{item.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                        Thiết lập vai trò tác nghiệp (Roles) & nhân viên làm việc (Users)
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        itemProgress === 100 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : itemProgress > 0 
                          ? 'bg-sky-100 text-[#1072ba]' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {itemProgress}%
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Organization Setup */}
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-t border-b border-gray-100 my-1 bg-gray-50">
                Cơ Cấu Tổ Chức (Organization Setup)
              </div>

              {EDU_MODULES.filter(m => m.moduleNumber === "00" && m.id !== "part-1").map((item) => {
                const isSelected = item.id === activePartId;
                const itemProgress = part2Progress;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActivePartId(item.id);
                      setDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50 text-[#1072ba] font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="pr-2 truncate">
                      <div className="text-xs truncate font-medium">{item.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                        Hội sở, Khu vực, Chi nhánh, PGD (TO)
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        itemProgress === 100 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : itemProgress > 0 
                          ? 'bg-sky-100 text-[#1072ba]' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {itemProgress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bên phải: Thanh đo tiến độ */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0" title={`Tiến độ hoàn thành: ${currentProgress}%`}>
          <div className="flex-1 bg-black/25 h-2 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full rounded-full bg-[#28a745] transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-white shrink-0 font-mono tracking-tight">
            {currentProgress}%
          </span>
        </div>
      </div>

      {/* Module Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-gray-800 text-xs bg-white">
        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 1: THIẾT LẬP ĐƠN VỊ TIỀN TỆ
            ========================================================== */}
        {activePartId === 'gl-part-1' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Tiêu đề & Mục tiêu */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân Hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Chi tiết luồng thực hành chuẩn */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành
              </h4>

              <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
                {/* Bước 1 */}
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1.5">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Truy cập Cấu hình Tiền tệ</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Đường dẫn: <strong className="text-gray-900">Admin ➔ Organization ➔ Currency Configuration</strong>.
                  </p>
                </div>

                {/* Bước 2 */}
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1.5">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Mở màn hình Thêm / Chỉnh sửa</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn nút <strong className="text-[#1072ba]">+ Add/Edit</strong> ở góc trên bên phải để vào giao diện <strong>Manage Currencies</strong>.
                  </p>
                </div>

                {/* Bước 3 */}
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-2">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Tìm kiếm và chọn đơn vị tiền tệ mẫu</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Tại ô nhập <code className="bg-white px-1 py-0.5 border rounded">Currency *</code>, gõ chữ <strong className="text-gray-900">VND</strong> hoặc <strong className="text-gray-900">v</strong>. Danh sách gợi ý sẽ hiển thị <code className="bg-white px-1 py-0.5 border rounded">(VND) Vietnamese Dong</code>. Bấm chọn đồng tiền này.
                  </p>
                  <div className="ml-6 p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-sky-900 leading-tight">
                      <strong>Dữ liệu mẫu:</strong> <code>(VND) Vietnamese Dong</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('admin-manage-currencies');
                        if (onStartPractice) onStartPractice('gl-part-1');
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-currency', {
                            detail: { code: 'VND', name: 'Vietnamese Dong' }
                          }));
                        }, 100);
                      }}
                      className="px-2.5 py-1.5 bg-[#1072ba] hover:bg-[#0d5d99] text-white text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer flex items-center shadow-2xs shrink-0"
                    >
                      <span>Nhập mẫu VND</span>
                    </button>
                  </div>
                </div>

                {/* Bước 4 */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[2px] space-y-1.5">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Nhấn dấu cộng xanh nước biển để Add</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    Khi đã chọn đúng đơn vị tiền tệ, <strong>nút dấu cộng (+) bên phải ô nhập sẽ chuyển sang màu xanh nước biển</strong>. Bấm vào nút dấu cộng này để thêm đồng tiền vào danh sách cấu hình.
                  </p>
                </div>

                {/* Bước 5 */}
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1.5">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                    <span>Lưu mẫu với đồng tiền VND</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn nút <strong className="text-gray-900">Submit</strong> ở cuối trang để hoàn tất lưu đồng tiền mẫu vào hệ thống.
                  </p>
                </div>

                {/* Bước 6 */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-[2px] space-y-1.5">
                  <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">6</span>
                    <span>Nạp đủ 5 đơn vị tiền tệ chuẩn trong Database</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    Sau khi submit xong mẫu, tiếp tục thực hành cấu hình đủ 5 đơn vị tiền tệ chuẩn trong Database của Takashimaya Bank: <code className="bg-white px-1 py-0.5 border rounded">VND</code>, <code className="bg-white px-1 py-0.5 border rounded">USD</code>, <code className="bg-white px-1 py-0.5 border rounded">JPY</code>, <code className="bg-white px-1 py-0.5 border rounded">CNY</code>, <code className="bg-white px-1 py-0.5 border rounded">IDR</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng 5 đơn vị tiền tệ chuẩn trong database */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                5 Đơn vị tiền tệ chuẩn trong Database
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-3">Mã Code</th>
                      <th className="py-1.5 px-3">Tên tiền tệ</th>
                      <th className="py-1.5 px-3 text-center">Vai trò</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-sky-50/50">
                      <td className="py-1.5 px-3 font-mono font-semibold text-[#1072ba]">VND</td>
                      <td className="py-1.5 px-3 font-medium">Vietnamese Dong</td>
                      <td className="py-1.5 px-3 text-center text-[10px] font-bold text-sky-700">Đồng hạch toán cơ sở (Base)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-mono font-semibold">USD</td>
                      <td className="py-1.5 px-3">US Dollar</td>
                      <td className="py-1.5 px-3 text-center text-[10px] text-gray-500">Ngoại tệ thanh toán QT</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-mono font-semibold">JPY</td>
                      <td className="py-1.5 px-3">Japanese Yen</td>
                      <td className="py-1.5 px-3 text-center text-[10px] text-gray-500">Ngoại tệ đối tác mẹ (TKB)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-mono font-semibold">CNY</td>
                      <td className="py-1.5 px-3">Chinese Yuan Renminbi</td>
                      <td className="py-1.5 px-3 text-center text-[10px] text-gray-500">Ngoại tệ thương mại</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-mono font-semibold">IDR</td>
                      <td className="py-1.5 px-3">Indonesian Rupiah</td>
                      <td className="py-1.5 px-3 text-center text-[10px] text-gray-500">Ngoại tệ khu vực ASEAN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 2: THIẾT LẬP 5 GL HEADER CẤP 1
            ========================================================== */}
        {activePartId === 'gl-part-2' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Tiêu đề & Mục tiêu */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân Hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                Phần 2: Thiết Lập 5 Tài Khoản GL Header Cấp 1
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Khai báo 5 tài khoản Tổng hợp cấp 1 cao nhất (Root GL Headers: 100000 TOTAL ASSETS, 200000 TOTAL LIABILITIES, 300000 TOTAL EQUITY, 400000 TOTAL INCOME, 500000 TOTAL EXPENSES) theo đúng chuẩn Mifos X để làm nền tảng xương sống cho toàn bộ cây tài khoản kế toán ngân hàng Takashimaya Bank.
              </p>
            </div>

            {/* Tiến độ chi tiết 5 Header */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Tiến độ thiết lập 5 Header cấp 1:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1072ba]">{glPart2Progress}%</span>
                  {glAccounts.some(a => ['100000', '200000', '300000', '400000', '500000'].includes(a.glCode)) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onResetGlHeaders) onResetGlHeaders();
                      }}
                      className="text-[10px] text-red-600 hover:text-red-700 font-medium underline cursor-pointer"
                      title="Xoá 5 Header để thực hành lại từ đầu"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { code: '100000', name: 'TOTAL ASSETS', type: 'ASSET' },
                  { code: '200000', name: 'TOTAL LIABILITIES', type: 'LIABILITY' },
                  { code: '300000', name: 'TOTAL EQUITY', type: 'EQUITY' },
                  { code: '400000', name: 'TOTAL INCOME', type: 'INCOME' },
                  { code: '500000', name: 'TOTAL EXPENSES', type: 'EXPENSE' },
                ].map((item, idx) => {
                  const isDone = glAccounts.some(a => a.glCode === item.code && (a.usage || '').toLowerCase() === 'header');
                  return (
                    <div key={item.code} className="flex items-center justify-between py-1 px-2 rounded bg-white border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span className="font-mono font-bold text-gray-900">{item.code}</span>
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-[10px] text-gray-400">({item.type})</span>
                      </div>
                      <span className={`text-[10px] font-semibold ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {isDone ? 'Đã thiết lập' : 'Chưa tạo'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Truy cập menu Accounting</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn vào tab <strong className="text-gray-900">Accounting</strong> trên thanh điều hướng chính ở đầu trang.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Chọn Chart of Accounts</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Trong bảng danh mục nghiệp vụ kế toán, nhấn vào mục <strong className="text-gray-900">Chart of Accounts</strong> (biểu tượng sơ đồ phân cấp).
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhấn nút + Add Account</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Ở góc trên bên phải màn hình Chart of Accounts, nhấn nút màu xanh <strong className="text-[#1072ba]">+ Add Account</strong> để mở biểu mẫu Create GL Account.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Nhập 5 tài khoản mẫu theo 5 hình chụp thực tế</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    Nhập đúng các thông số bắt buộc. Lưu ý: Với tài khoản <strong>HEADER</strong>, ô <code className="bg-white px-1 border rounded text-[10px]">Manual Entries Allowed</code> luôn để <strong>TRỐNG (Unchecked)</strong> vì tài khoản tổng hợp không cho phép hạch toán thủ công trực tiếp.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu 5 hình mẫu thực tế */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số chi tiết theo 5 hình mẫu thực tế
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">Hình</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản</th>
                      <th className="py-1.5 px-2">Usage</th>
                      <th className="py-1.5 px-2 text-center">Manual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Hình 1</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">100000</td>
                      <td className="py-1.5 px-2">TOTAL ASSETS</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                      <td className="py-1.5 px-2 text-center text-red-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Hình 2</td>
                      <td className="py-1.5 px-2">LIABILITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">200000</td>
                      <td className="py-1.5 px-2">TOTAL LIABILITIES</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                      <td className="py-1.5 px-2 text-center text-red-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Hình 3</td>
                      <td className="py-1.5 px-2">EQUITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">300000</td>
                      <td className="py-1.5 px-2">TOTAL EQUITY</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                      <td className="py-1.5 px-2 text-center text-red-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Hình 4</td>
                      <td className="py-1.5 px-2">INCOME</td>
                      <td className="py-1.5 px-2 font-mono font-bold">400000</td>
                      <td className="py-1.5 px-2">TOTAL INCOME</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                      <td className="py-1.5 px-2 text-center text-red-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Hình 5</td>
                      <td className="py-1.5 px-2">EXPENSE</td>
                      <td className="py-1.5 px-2 font-mono font-bold">500000</td>
                      <td className="py-1.5 px-2">TOTAL EXPENSES</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                      <td className="py-1.5 px-2 text-center text-red-500 font-bold">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-500 italic mt-1">
                * Mẹo: Trên form Create GL Account đã có sẵn thanh công cụ "Điền nhanh mẫu 5 Header", bạn có thể click để tự động điền chính xác 100% dữ liệu mẫu của từng hình.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 3: GL CẤP 2 (CHART OF ACCOUNTS LEVEL 2)
            ========================================================== */}
        {activePartId === 'gl-part-3' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Tiến độ chi tiết 11 GL Cấp 2 */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Tiến độ thiết lập 11 GL Cấp 2:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1072ba]">{glPart3Progress}%</span>
                  {glAccounts.some(a => ['110000', '120000', '130000', '210000', '220000', '310000', '410000', '420000', '510000', '520000', '530000'].includes(a.glCode)) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onResetGlLevel2) onResetGlLevel2();
                      }}
                      className="text-[10px] text-red-600 hover:text-red-700 font-medium underline cursor-pointer"
                      title="Xoá các tài khoản GL Cấp 2 để thực hành lại"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-[11px] max-h-60 overflow-y-auto pr-1">
                {[
                  { code: '110000', name: 'CASH AND BANK BALANCES', type: 'ASSET', parent: '100000' },
                  { code: '120000', name: 'LOAN ASSETS', type: 'ASSET', parent: '100000' },
                  { code: '130000', name: 'OTHER ASSETS', type: 'ASSET', parent: '100000' },
                  { code: '210000', name: 'CUSTOMER DEPOSITS', type: 'LIABILITY', parent: '200000' },
                  { code: '220000', name: 'FUNDING AND CLEARING', type: 'LIABILITY', parent: '200000' },
                  { code: '310000', name: 'CAPITAL AND RESERVES', type: 'EQUITY', parent: '300000' },
                  { code: '410000', name: 'INTEREST INCOME', type: 'INCOME', parent: '400000' },
                  { code: '420000', name: 'FEE AND OTHER INCOME', type: 'INCOME', parent: '400000' },
                  { code: '510000', name: 'INTEREST EXPENSES', type: 'EXPENSE', parent: '500000' },
                  { code: '520000', name: 'CREDIT LOSS EXPENSES', type: 'EXPENSE', parent: '500000' },
                  { code: '530000', name: 'OPERATING EXPENSES', type: 'EXPENSE', parent: '500000' },
                ].map((item, idx) => {
                  const isDone = glAccounts.some(a => a.glCode === item.code && (a.usage || '').toLowerCase() === 'header');
                  return (
                    <div key={item.code} className="flex items-center justify-between py-1 px-2 rounded bg-white border border-gray-100">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span className="font-mono font-bold text-gray-900 shrink-0">{item.code}</span>
                        <span className="text-gray-700 truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">({item.type} ➔ {item.parent})</span>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {isDone ? 'Đã tạo' : 'Chưa tạo'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Truy cập menu Accounting</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn vào tab <strong className="text-gray-900">Accounting</strong> trên thanh điều hướng chính ở đầu trang.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Chọn Chart of Accounts</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Trong bảng danh mục nghiệp vụ kế toán, nhấn vào mục <strong className="text-gray-900">Chart of Accounts</strong>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhấn nút + Add Account</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Ở góc trên bên phải màn hình Chart of Accounts, nhấn nút màu xanh <strong className="text-[#1072ba]">+ Add Account</strong> để mở biểu mẫu Create GL Account.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Nhập 5 tài khoản GL Cấp 2 mẫu ở 5 nhóm và gắn Parent</span>
                  </div>
                  <p className="text-gray-700 pl-6 leading-relaxed">
                    Bạn sẽ thực hành tạo 5 tài khoản GL Cấp 2 đại diện cho 5 nhóm tài khoản. Điểm mấu chốt: trường <strong className="text-gray-900">Parent</strong> phải được chọn đúng tài khoản Header Cấp 1 tương ứng (100000, 200000, 300000, 400000, 500000). Sau khi hoàn thành 5 tài khoản, bạn có thể nhập tự động toàn bộ 11 tài khoản vào hệ thống.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu 5 tài khoản mẫu đại diện */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số 5 tài khoản GL Cấp 2 mẫu thực hành
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">Nhóm</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản</th>
                      <th className="py-1.5 px-2">Parent Header</th>
                      <th className="py-1.5 px-2">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 1</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110000</td>
                      <td className="py-1.5 px-2">CASH AND BANK BALANCES</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">100000 TOTAL ASSETS</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 2</td>
                      <td className="py-1.5 px-2">LIABILITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">210000</td>
                      <td className="py-1.5 px-2">CUSTOMER DEPOSITS</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">200000 TOTAL LIABILITIES</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 3</td>
                      <td className="py-1.5 px-2">EQUITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">310000</td>
                      <td className="py-1.5 px-2">CAPITAL AND RESERVES</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">300000 TOTAL EQUITY</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 4</td>
                      <td className="py-1.5 px-2">INCOME</td>
                      <td className="py-1.5 px-2 font-mono font-bold">410000</td>
                      <td className="py-1.5 px-2">INTEREST INCOME</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">400000 TOTAL INCOME</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 5</td>
                      <td className="py-1.5 px-2">EXPENSE</td>
                      <td className="py-1.5 px-2 font-mono font-bold">510000</td>
                      <td className="py-1.5 px-2">INTEREST EXPENSES</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">500000 TOTAL EXPENSES</td>
                      <td className="py-1.5 px-2 font-semibold">HEADER</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 4: GL CHI TIẾT (CHART OF ACCOUNTS DETAILS)
            ========================================================== */}
        {activePartId === 'gl-part-4' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Tiến độ chi tiết 54 GL Chi tiết */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Tiến độ thiết lập 54 tài khoản GL Chi tiết:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1072ba]">{glPart4Progress}%</span>
                  {glAccounts.some(a => (a.usage || '').toLowerCase() === 'detail') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onResetGlDetails) onResetGlDetails();
                      }}
                      className="text-[10px] text-red-600 hover:text-red-700 font-medium underline cursor-pointer"
                      title="Xoá các tài khoản GL Detail để thực hành lại"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-[11px] max-h-60 overflow-y-auto pr-1">
                {[
                  { code: '110101', name: 'Cash at Vault', type: 'ASSET', parent: '110000' },
                  { code: '110102', name: 'Cash at Teller', type: 'ASSET', parent: '110000' },
                  { code: '110201', name: 'Settlement Bank Account', type: 'ASSET', parent: '110000' },
                  { code: '120101', name: 'Retail Loan Principal', type: 'ASSET', parent: '120000' },
                  { code: '120102', name: 'Corporate Loan Principal', type: 'ASSET', parent: '120000' },
                  { code: '210101', name: 'Savings Deposits', type: 'LIABILITY', parent: '210000' },
                  { code: '210102', name: 'Current Account Deposits', type: 'LIABILITY', parent: '210000' },
                  { code: '210103', name: 'Fixed Deposits', type: 'LIABILITY', parent: '210000' },
                  { code: '310101', name: 'Contributed Capital', type: 'EQUITY', parent: '310000' },
                  { code: '310102', name: 'Retained Earnings', type: 'EQUITY', parent: '310000' },
                  { code: '410101', name: 'Loan Interest Income', type: 'INCOME', parent: '410000' },
                  { code: '420101', name: 'Loan Processing Fee Income', type: 'INCOME', parent: '420000' },
                  { code: '510101', name: 'Savings Interest Expense', type: 'EXPENSE', parent: '510000' },
                  { code: '530101', name: 'Operating Expense', type: 'EXPENSE', parent: '530000' },
                ].map((item, idx) => {
                  const isDone = glAccounts.some(a => a.glCode === item.code && (a.usage || '').toLowerCase() === 'detail');
                  return (
                    <div key={item.code} className="flex items-center justify-between py-1 px-2 rounded bg-white border border-gray-100">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span className="font-mono font-bold text-gray-900 shrink-0">{item.code}</span>
                        <span className="text-gray-700 truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">({item.type} ➔ {item.parent})</span>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {isDone ? 'Đã tạo' : 'Chưa tạo'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Truy cập menu Accounting</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn vào tab <strong className="text-gray-900">Accounting</strong> trên thanh điều hướng chính ở đầu trang.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Chọn Chart of Accounts</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Trong bảng danh mục nghiệp vụ kế toán, nhấn vào mục <strong className="text-gray-900">Chart of Accounts</strong>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhấn nút + Add Account</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Ở góc trên bên phải màn hình Chart of Accounts, nhấn nút màu xanh <strong className="text-[#1072ba]">+ Add Account</strong> để mở biểu mẫu Create GL Account.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Nhập 5 tài khoản GL Chi tiết mẫu (Account Usage chọn DETAIL)</span>
                  </div>
                  <p className="text-gray-700 pl-6 leading-relaxed">
                    Khác với tài khoản tổng hợp HEADER, tài khoản chi tiết được thiết lập mục <strong className="text-gray-900">Account Usage = DETAIL</strong> để trực tiếp phục vụ hạch toán bút toán ghi Nợ/Có. Trường <strong className="text-gray-900">Parent</strong> phải được chọn đúng tài khoản Header Cấp 2 tương ứng (110000, 210000, 310000, 410000, 510000).
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu 5 tài khoản mẫu đại diện */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số 5 tài khoản GL Chi tiết mẫu thực hành
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">Nhóm</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản</th>
                      <th className="py-1.5 px-2">Parent Header</th>
                      <th className="py-1.5 px-2">Usage</th>
                      <th className="py-1.5 px-2 text-center">Manual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 1</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110101</td>
                      <td className="py-1.5 px-2">Cash at Vault</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">110000 CASH AND BANK BALANCES</td>
                      <td className="py-1.5 px-2 font-semibold text-emerald-700">DETAIL</td>
                      <td className="py-1.5 px-2 text-center font-bold text-emerald-600">✓</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 2</td>
                      <td className="py-1.5 px-2">LIABILITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">210101</td>
                      <td className="py-1.5 px-2">Savings Deposits</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">210000 CUSTOMER DEPOSITS</td>
                      <td className="py-1.5 px-2 font-semibold text-emerald-700">DETAIL</td>
                      <td className="py-1.5 px-2 text-center font-bold text-red-500">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 3</td>
                      <td className="py-1.5 px-2">EQUITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">310101</td>
                      <td className="py-1.5 px-2">Contributed Capital</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">310000 CAPITAL AND RESERVES</td>
                      <td className="py-1.5 px-2 font-semibold text-emerald-700">DETAIL</td>
                      <td className="py-1.5 px-2 text-center font-bold text-emerald-600">✓</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 4</td>
                      <td className="py-1.5 px-2">INCOME</td>
                      <td className="py-1.5 px-2 font-mono font-bold">410101</td>
                      <td className="py-1.5 px-2">Loan Interest Income</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">410000 INTEREST INCOME</td>
                      <td className="py-1.5 px-2 font-semibold text-emerald-700">DETAIL</td>
                      <td className="py-1.5 px-2 text-center font-bold text-red-500">✕</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">Mẫu 5</td>
                      <td className="py-1.5 px-2">EXPENSE</td>
                      <td className="py-1.5 px-2 font-mono font-bold">510101</td>
                      <td className="py-1.5 px-2">Savings Interest Expense</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">510000 INTEREST EXPENSES</td>
                      <td className="py-1.5 px-2 font-semibold text-emerald-700">DETAIL</td>
                      <td className="py-1.5 px-2 text-center font-bold text-red-500">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 5: FINANCIAL ACTIVITY MAPPINGS
            ========================================================== */}
        {activePartId === 'gl-part-5' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Thanh tiến độ & Nút Reset */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">Tiến độ thiết lập Financial Activity Mappings</span>
                <span className={`font-bold ${isGlPart5Complete ? 'text-emerald-700' : 'text-[#1072ba]'}`}>
                  {glPart5Progress}% ({financialActivities.length}/6 liên kết)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isGlPart5Complete ? 'bg-[#28a745]' : 'bg-[#1072ba]'}`}
                  style={{ width: `${glPart5Progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                <span>Yêu cầu: Liên kết đủ 6 hoạt động tài chính tự động</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetFinancialActivities) {
                      onResetFinancialActivities();
                    }
                  }}
                  className="text-gray-500 hover:text-red-600 underline cursor-pointer"
                >
                  Thiết lập lại từ đầu
                </button>
              </div>
            </div>

            {/* Danh sách 6 hoạt động tài chính tự động */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Danh mục 6 liên kết hoạt động tài chính (Mifos X System)
                </h4>
                <span className="text-[11px] text-gray-500 font-mono">
                  {financialActivities.length}/6
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {[
                  { step: 1, code: '300', name: 'Opening Balances Transfer Contra', accCode: '310199', accName: 'Opening Balance Contra', type: 'EQUITY' },
                  { step: 2, code: '101', name: 'Cash At Main Vault', accCode: '110101', accName: 'Cash at Vault', type: 'ASSET' },
                  { step: 3, code: '102', name: 'Cash At Teller', accCode: '110102', accName: 'Cash at Teller', type: 'ASSET' },
                  { step: 4, code: '103', name: 'Fund Source', accCode: '110201', accName: 'Settlement Bank Account', type: 'ASSET' },
                  { step: 5, code: '100', name: 'Asset Transfer', accCode: '130101', accName: 'Clearing Receivable', type: 'ASSET' },
                  { step: 6, code: '200', name: 'Liability Transfer', accCode: '220201', accName: 'Clearing Payable', type: 'LIABILITY' },
                ].map((item) => {
                  const isDone = financialActivities.some(a => String(a.activityCode) === String(item.code));
                  return (
                    <div key={item.code} className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white border border-gray-100">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? '✓' : item.step}
                        </span>
                        <span className="font-mono font-bold text-gray-900 shrink-0">({item.code})</span>
                        <span className="text-gray-800 truncate">{item.name}</span>
                        <span className="text-gray-400 shrink-0">➔</span>
                        <span className="font-mono text-[#1072ba] shrink-0">{item.accCode}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">({item.type})</span>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {isDone ? 'Đã liên kết' : 'Chưa liên kết'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Truy cập menu Accounting</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nhấn vào tab <strong className="text-gray-900">Accounting</strong> trên thanh điều hướng chính ở đầu trang.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Chọn Accounts Linked to Financial Activities</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Trong bảng danh mục nghiệp vụ kế toán, nhấn vào mục <strong className="text-gray-900">Accounts Linked to Financial Activities</strong>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhấn nút + Define New Mapping</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Ở góc trên bên phải màn hình danh sách, nhấn nút màu xanh <strong className="text-[#1072ba]">+ Define New Mapping</strong> để mở biểu mẫu thiết lập liên kết mới.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Chọn Financial Activity và Account rồi bấm Submit</span>
                  </div>
                  <p className="text-gray-700 pl-6 leading-relaxed">
                    Chọn <strong className="text-gray-900">Financial Activity *</strong> từ danh sách hệ thống, sau đó chọn tài khoản GL chi tiết tương ứng ở trường <strong className="text-gray-900">Account *</strong> (tìm kiếm theo mã hoặc tên), rồi nhấn <strong className="text-[#1072ba]">Submit</strong> để ghi nhận liên kết.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu 6 liên kết Financial Activities */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số 6 liên kết Financial Activity Mappings mẫu
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">STT</th>
                      <th className="py-1.5 px-2">Mã</th>
                      <th className="py-1.5 px-2">Financial Activity</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản (Account)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">1</td>
                      <td className="py-1.5 px-2 font-mono font-bold">300</td>
                      <td className="py-1.5 px-2">Opening Balances Transfer Contra</td>
                      <td className="py-1.5 px-2">EQUITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">310199</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Opening Balance Contra</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">2</td>
                      <td className="py-1.5 px-2 font-mono font-bold">101</td>
                      <td className="py-1.5 px-2">Cash At Main Vault</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110101</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Cash at Vault</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">3</td>
                      <td className="py-1.5 px-2 font-mono font-bold">102</td>
                      <td className="py-1.5 px-2">Cash At Teller</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110102</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Cash at Teller</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">4</td>
                      <td className="py-1.5 px-2 font-mono font-bold">103</td>
                      <td className="py-1.5 px-2">Fund Source</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110201</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Settlement Bank Account</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">5</td>
                      <td className="py-1.5 px-2 font-mono font-bold">100</td>
                      <td className="py-1.5 px-2">Asset Transfer</td>
                      <td className="py-1.5 px-2">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">130101</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Clearing Receivable</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">6</td>
                      <td className="py-1.5 px-2 font-mono font-bold">200</td>
                      <td className="py-1.5 px-2">Liability Transfer</td>
                      <td className="py-1.5 px-2">LIABILITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">220201</td>
                      <td className="py-1.5 px-2 font-medium text-gray-900">Clearing Payable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 6: OPENING BALANCE MIGRATION & JOURNAL ENTRIES
            ========================================================== */}
        {activePartId === 'gl-part-6' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Thanh tiến độ & Nút Reset */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">Tiến độ Khởi tạo số dư đầu kỳ</span>
                <span className={`font-bold ${isGlPart6Complete ? 'text-emerald-700' : 'text-[#1072ba]'}`}>
                  {glPart6Progress}% ({contraAccountConfigEnabled && hasOpeningBalanceSubmitted ? '2/2 mốc' : contraAccountConfigEnabled || hasOpeningBalanceSubmitted ? '1/2 mốc' : '0/2 mốc'})
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isGlPart6Complete ? 'bg-[#28a745]' : 'bg-[#1072ba]'}`}
                  style={{ width: `${glPart6Progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                <span>Yêu cầu: Bật Contra Account & Khởi tạo số dư 1 tỷ cân đối Nợ/Có</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetOpeningBalances) onResetOpeningBalances();
                  }}
                  className="inline-flex items-center space-x-1 text-[11px] text-[#1072ba] hover:underline cursor-pointer"
                  title="Xóa trạng thái để thực hành lại"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Thiết lập lại từ đầu</span>
                </button>
              </div>
            </div>

            {/* Danh mục kiểm tra checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Tiêu chuẩn kiểm tra hoàn thành (3 Tiêu chí)
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      contraAccountConfigEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {contraAccountConfigEnabled ? '✓' : '1'}
                    </span>
                    <span className="font-mono font-medium text-gray-900">office-opening-balances-contra-account</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${contraAccountConfigEnabled ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {contraAccountConfigEnabled ? 'Đã kích hoạt' : 'Chưa bật'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      hasOpeningBalanceSubmitted ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {hasOpeningBalanceSubmitted ? '✓' : '2'}
                    </span>
                    <span className="text-gray-900">Khởi tạo số dư Hội sở (TKB - HO) 1.000.000.000 VND</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${hasOpeningBalanceSubmitted ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {hasOpeningBalanceSubmitted ? 'Đã hoàn tất' : 'Chưa nhập'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      hasOpeningBalanceSubmitted ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {hasOpeningBalanceSubmitted ? '✓' : '3'}
                    </span>
                    <span className="text-gray-900">Đối soát bút toán sổ cái tại Search Journal Entries</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${hasOpeningBalanceSubmitted ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {hasOpeningBalanceSubmitted ? 'Đã ghi sổ' : 'Chưa kiểm tra'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Admin → System → Configurations</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Tìm dòng <strong className="text-gray-900">office-opening-balances-contra-account</strong> và bấm công tắc chuyển sang <strong className="text-emerald-600">Enabled</strong> để mở khóa tính năng nhập số dư đầu kỳ.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Accounting → Migrate Opening Balances</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Chọn văn phòng <strong className="text-gray-900">Takashimaya Bank (TKB) - HO</strong> (Hội sở) rồi nhấn nút <strong className="text-[#1072ba]">Retrieve</strong> để truy xuất bảng tài khoản kế toán.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhập số dư Nợ/Có cân đối (1.000.000.000 VND)</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Chọn tiền tệ <strong className="text-gray-900">VND</strong>, ngày <strong className="text-gray-900">12/10/2026</strong>. Nhập Nợ: <strong className="text-gray-900">Cash at Vault</strong> (200.000.000), <strong className="text-gray-900">Settlement Bank Account</strong> (800.000.000). Nhập Có: <strong className="text-gray-900">Contributed Capital</strong> (1.000.000.000). Sau đó nhấn <strong className="text-[#1072ba]">Submit</strong>.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Accounting → Search Journal Entries</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    Truy cập màn hình tra cứu bút toán, chỉnh khoảng ngày lọc bao gồm ngày giao dịch 12/10/2026 để xem hệ thống tự động sinh bút toán sổ cái cân đối Nợ = Có hoàn chỉnh.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu số liệu mẫu */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số số dư đầu kỳ thực hành
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản</th>
                      <th className="py-1.5 px-2 text-right">Debit (Nợ)</th>
                      <th className="py-1.5 px-2 text-right">Credit (Có)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110101</td>
                      <td className="py-1.5 px-2 font-medium">Cash at Vault</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-emerald-700">200,000,000</td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-400">—</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-sky-700">ASSET</td>
                      <td className="py-1.5 px-2 font-mono font-bold">110201</td>
                      <td className="py-1.5 px-2 font-medium">Settlement Bank Account</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-emerald-700">800,000,000</td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-400">—</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-purple-700">EQUITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">310101</td>
                      <td className="py-1.5 px-2 font-medium">Contributed Capital</td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-400">—</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-rose-700">1,000,000,000</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="py-1.5 px-2 text-right">Tổng cộng cân đối:</td>
                      <td className="py-1.5 px-2 text-right text-emerald-700">1,000,000,000</td>
                      <td className="py-1.5 px-2 text-right text-rose-700">1,000,000,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 7: GHI NHẬN BÚT TOÁN THỦ CÔNG (MANUAL JOURNAL ENTRIES)
            ========================================================== */}
        {activePartId === 'gl-part-7' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Khung lý thuyết nghiệp vụ */}
            <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-[2px] space-y-2">
              <h4 className="text-xs font-bold text-[#1072ba] flex items-center gap-1.5">
                <span>Kiến thức cốt lõi: Nghiệp vụ Manual Journal Entries</span>
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Trong vận hành ngân hàng Core Banking, đa số bút toán được tự động hạch toán thông qua các phân hệ nghiệp vụ (như gửi tiền Savings, giải ngân/thu nợ Loans). Tuy nhiên, nhân viên kế toán (Maker) cần ghi nhận các giao dịch tài chính phát sinh nội bộ (như chi phí vận hành, trích lập chi phí phải trả dồn tích, phân bổ chi phí, điều chỉnh sai sót) trực tiếp vào sổ cái tổng hợp GL thông qua chức năng <strong>Create Journal Entries</strong>.
              </p>
              <div className="text-[11px] text-gray-600 border-t border-sky-100 pt-2 space-y-1">
                <div>• <strong>Nguyên tắc ghi sổ kép (Double-Entry Bookkeeping):</strong> Tổng số tiền ghi Nợ (Total Debit) luôn luôn phải bằng Tổng số tiền ghi Có (Total Credit). Nút Submit chỉ được kích hoạt khi trạng thái cân đối đạt được.</div>
                <div>• <strong>Mã tham chiếu (Reference Number):</strong> Mã chứng từ hạch toán nội bộ phục vụ đối soát, kiểm toán nội bộ và truy vết giao dịch.</div>
              </div>
            </div>

            {/* Danh mục kiểm tra checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Tiêu chuẩn kiểm tra hoàn thành (3 Tiêu chí)
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isGlPart7Complete ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isGlPart7Complete ? '✓' : '1'}
                    </span>
                    <span className="text-gray-900">Tạo bút toán tại Create Journal Entries (Office TKB - HO, VND)</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${isGlPart7Complete ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {isGlPart7Complete ? 'Đã hoàn tất' : 'Chưa tạo'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isGlPart7Complete ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isGlPart7Complete ? '✓' : '2'}
                    </span>
                    <span className="text-gray-900">Định khoản: Nợ TK 530101 (2 tr) = Có TK 220301 (2 tr) (Ref: TKB-OPEX-202610-001)</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${isGlPart7Complete ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {isGlPart7Complete ? 'Đã cân bằng' : 'Chưa ghi nhận'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isGlPart7Complete ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isGlPart7Complete ? '✓' : '3'}
                    </span>
                    <span className="text-gray-900">Đối soát bút toán sổ cái tại Search Journal Entries (01/01/2026 - 31/10/2026)</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${isGlPart7Complete ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {isGlPart7Complete ? 'Đã ghi sổ' : 'Chưa kiểm tra'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn (4 Thao tác)
              </h4>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Accounting → Create Journal Entries</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Trong phân hệ Accounting, bấm vào mục <strong className="text-gray-900">Create Journal Entries</strong> để mở biểu mẫu ghi nhận bút toán thủ công.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Chọn Office & Currency</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Chọn Office: <strong className="text-gray-900">Takashimaya Bank (TKB) - HO</strong> và Currency: <strong className="text-gray-900">Vietnamese Dong [VND]</strong>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Nhập định khoản Nợ/Có cân đối & Submit</span>
                  </div>
                  <p className="text-gray-600 pl-6">
                    Nợ: <strong className="text-gray-900">(530101) Operating Expense</strong> - 2.000.000 VND.<br />
                    Có: <strong className="text-gray-900">(220301) Accrued Operating Expenses Payable</strong> - 2.000.000 VND.<br />
                    Mã tham chiếu: <strong className="text-gray-900">TKB-OPEX-202610-001</strong>, Ngày: <strong className="text-gray-900">9/1/2026</strong>. Sau đó nhấn <strong className="text-[#1072ba]">Submit</strong>.
                  </p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-[2px] space-y-2">
                  <div className="font-semibold text-[#1072ba] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1072ba] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Accounting → Search Journal Entries</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    Truy cập màn hình tra cứu bút toán sổ cái, chỉnh khoảng ngày lọc (01/01/2026 - 31/10/2026) để kiểm tra giao dịch chi phí vận hành trích trước đã được ghi sổ an toàn và chính xác.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng đối chiếu số liệu mẫu */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bảng thông số bút toán thủ công mẫu
              </h4>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">GL Code</th>
                      <th className="py-1.5 px-2">Tên tài khoản</th>
                      <th className="py-1.5 px-2 text-right">Debit (Nợ)</th>
                      <th className="py-1.5 px-2 text-right">Credit (Có)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-amber-700">EXPENSE</td>
                      <td className="py-1.5 px-2 font-mono font-bold">530101</td>
                      <td className="py-1.5 px-2 font-medium">Operating Expense</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-emerald-700">2,000,000</td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-400">—</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-bold text-rose-700">LIABILITY</td>
                      <td className="py-1.5 px-2 font-mono font-bold">220301</td>
                      <td className="py-1.5 px-2 font-medium">Accrued Operating Expenses Payable</td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-400">—</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-rose-700">2,000,000</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="py-1.5 px-2 text-right">Tổng cộng cân đối:</td>
                      <td className="py-1.5 px-2 text-right text-emerald-700">2,000,000</td>
                      <td className="py-1.5 px-2 text-right text-rose-700">2,000,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 8: ACCOUNTING RULES
            ========================================================== */}
        {activePartId === 'gl-part-8' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Chi tiết giải thích từng ô theo đúng yêu cầu nghiệp vụ ngân hàng */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Ý Nghĩa Nghiệp Vụ Từng Ô Trong Accounting Rule
              </h4>

              <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-[2px] space-y-1.5 text-xs text-gray-700">
                <div className="font-bold text-sky-900">1. Accounting Rule Name *</div>
                <p className="text-gray-600">
                  Tên định danh quy tắc kế toán mẫu (ví dụ: <strong className="text-gray-900">Operating Expense Accrual</strong>). Giúp kế toán viên dễ dàng áp dụng mẫu khi thực hiện Frequent Postings hoặc chuẩn hóa luồng định khoản.
                </p>
              </div>

              <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-[2px] space-y-1.5 text-xs text-gray-700">
                <div className="font-bold text-sky-900">2. Office *</div>
                <p className="text-gray-600">
                  Chi nhánh hoặc đơn vị áp dụng quy tắc. Ở đây chọn <strong className="text-gray-900">Takashimaya Bank (TKB) - HO</strong> (Hội sở chính).
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-[2px] space-y-1.5 text-xs text-gray-800">
                <div className="font-bold text-emerald-900">
                  Account to Debit (530101):
                </div>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  Ghi tăng chi phí hoạt động khi ngân hàng phát sinh chi phí. (Tài khoản 530101 - Operating Expense, thuộc nhóm Chi phí loại 5).
                </p>
              </div>

              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-[2px] space-y-1.5 text-xs text-gray-800">
                <div className="font-bold text-rose-900">
                  Account to Credit (220301):
                </div>
                <p className="text-rose-950 font-medium leading-relaxed">
                  Ghi tăng nghĩa vụ phải trả do ngân hàng chưa thực hiện thanh toán. (Tài khoản 220301 - Accrued Operating Expenses Payable, thuộc nhóm Nợ phải trả loại 2).
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1.5 text-xs text-gray-700">
                <div className="font-bold text-gray-900">Description</div>
                <p className="text-gray-600 italic">
                  "Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries." — Diễn giải chi tiết cho bút toán dồn tích (Accrual Basis).
                </p>
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-[2px] space-y-2 text-xs text-amber-900">
              <div className="font-bold text-amber-950">
                Quy trình thực hành:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-amber-900/90 pl-1">
                <li>Vào <strong>Accounting → Accounting Rules</strong>.</li>
                <li>Bấm nút <strong>+ Add Rule</strong>.</li>
                <li>Nhập <em>Operating Expense Accrual</em> và chọn <em>Takashimaya Bank (TKB) - HO</em>.</li>
                <li>Chọn Account to Debit: <em>Operating Expense (530101)</em>.</li>
                <li>Chọn Account to Credit: <em>Accrued Operating Expenses Payable (220301)</em>.</li>
                <li>Nhập Description và nhấn <strong>Submit</strong>.</li>
                <li>Hệ thống chuyển sang màn hình <strong>View Accounting Rule</strong> xem lại toàn bộ cấu hình quy tắc vừa tạo.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: PHÂN HỆ 01 - PHẦN 9: FREQUENT POSTINGS
            ========================================================== */}
        {activePartId === 'gl-part-9' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Accounting / GL
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Khung lý thuyết nghiệp vụ */}
            <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-[2px] space-y-2">
              <h4 className="text-xs font-bold text-[#1072ba]">
                Kiến thức cốt lõi: Nghiệp vụ Frequent Postings
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Trong vận hành ngân hàng Core Banking, nghiệp vụ Frequent Postings cho phép nhân viên kế toán sử dụng các quy tắc kế toán đã được phê duyệt sẵn (Accounting Rules) để ghi nhận nhanh các giao dịch định kỳ (như chi phí bảo trì hệ thống định kỳ, trích trước chi phí hàng tháng) mà không cần phải chọn thủ công từng tài khoản kế toán, giảm thiểu tối đa sai sót và tiết kiệm thời gian hạch toán.
              </p>
              <div className="text-[11px] text-gray-600 border-t border-sky-100 pt-2 space-y-1">
                <div>• Khi chọn quy tắc Operating Expense Accrual, hệ thống tự động tải cặp tài khoản: Nợ TK 530101 (Operating Expense) và Có TK 220301 (Accrued Operating Expenses Payable).</div>
                <div>• Sau khi bấm Submit, hệ thống tự động ghi sổ cái và điều hướng trực tiếp sang màn hình chi tiết giao dịch (mã tham chiếu hệ thống: a2f68debe1a7) để kế toán viên kiểm tra đối soát hai bút toán 57 và 58.</div>
              </div>
            </div>

            {/* Bảng thông số giao dịch thực hành */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Thông Số Giao Dịch Thực Hành Mẫu
              </h4>

              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1.5 text-xs text-gray-700">
                <div>Office: <strong>Takashimaya Bank (TKB) - HO</strong></div>
                <div>Accounting Rule: <strong>Operating Expense Accrual</strong></div>
                <div>Currency: <strong>Vietnamese Dong [VND]</strong></div>
                <div>Affected GL Entry (Debit): <strong>Operating Expense (530101)</strong> — <strong>5.000.000 VND</strong></div>
                <div>Affected GL Entry (Credit): <strong>Accrued Operating Expenses Payable (220301)</strong> — <strong>5.000.000 VND</strong></div>
                <div>Reference Number: <strong>TKB-OPEX-202610-002</strong></div>
                <div>Transaction Date: <strong>10/12/2026</strong> (Hiển thị 12 October 2026)</div>
                <div>Comments: <em>"Accrual of VND 5,000,000 for IT system maintenance services, pending supplier payment."</em></div>
              </div>
            </div>

            {/* Quy trình thực hành */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-[2px] space-y-2 text-xs text-amber-900">
              <div className="font-bold text-amber-950">
                Quy trình thực hành:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-amber-900/90 pl-1">
                <li>Vào <strong>Accounting → Frequent Postings</strong>.</li>
                <li>Chọn <strong>Office</strong>: <em>Takashimaya Bank (TKB) - HO</em>.</li>
                <li>Chọn <strong>Accounting Rule</strong>: <em>Operating Expense Accrual</em>.</li>
                <li>Chọn <strong>Currency</strong>: <em>Vietnamese Dong [VND]</em>.</li>
                <li>Nhập <strong>Debit Amount</strong>: <em>5000000</em> và <strong>Credit Amount</strong>: <em>5000000</em>.</li>
                <li>Nhập <strong>Reference Number</strong>: <em>TKB-OPEX-202610-002</em> và <strong>Transaction Date</strong>: <em>10/12/2026</em>.</li>
                <li>Nhập <strong>Comments</strong>: <em>Accrual of VND 5,000,000 for IT system maintenance services, pending supplier payment.</em></li>
                <li>Nhấn <strong>Submit</strong> để ghi sổ cái và hệ thống chuyển sang màn hình <strong>a2f68debe1a7</strong> xem chi tiết hai bút toán đối ứng 57 và 58.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: USER & ACCESS MANAGEMENT (KHÔNG PHẢI PHÂN HỆ)
            ========================================================== */}
        {activePartId === 'part-1' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Header thông tin bài học */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                User & Access Management
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Khung lý thuyết nghiệp vụ */}
            <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-[2px] space-y-2">
              <h4 className="text-xs font-bold text-[#1072ba]">
                Kiến thức cốt lõi: Quản trị người dùng & Phân quyền trong Ngân hàng
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Trong hệ thống Core Banking, phân quyền tác nghiệp và quản lý định danh người dùng là lớp bảo vệ tối quan trọng nhằm ngăn chặn rủi ro gian lận, xung đột lợi ích và đảm bảo tính toàn vẹn dữ liệu tài chính.
              </p>
              <div className="text-[11px] text-gray-600 border-t border-sky-100 pt-2 space-y-1.5 leading-relaxed">
                <div>• <strong>Roles (Vai trò nghiệp vụ)</strong>: Đại diện cho chức danh và phạm vi quyền hạn trong ngân hàng (như Giao dịch viên - Teller, Kiểm soát viên - Checker, Cán bộ tín dụng - Loan Officer, Kế toán tổng hợp, Quản trị viên). Mỗi Role tập hợp danh mục các quyền hạn (Permissions) được phép thao tác.</div>
                <div>• <strong>Permissions (Quyền hạn chi tiết)</strong>: Hệ thống Mifos quản lý chi tiết quyền theo từng phân hệ tác nghiệp (Read, Create, Update, Delete) cho các đối tượng Khách hàng, Tiền gửi, Tín dụng, Kế toán sổ cái...</div>
                <div>• <strong>Users (Tài khoản người dùng)</strong>: Đại diện cho từng nhân sự cụ thể làm việc tại ngân hàng, được cấp Username định danh, gắn với Chi nhánh / Phòng giao dịch trực thuộc (Office) và được phân bổ các Roles tương ứng với công việc.</div>
                <div>• <strong>Nguyên tắc kiểm soát 4 mắt (Dual Control / Maker - Checker)</strong>: Cán bộ khởi tạo giao dịch (Maker) không được phép tự phê duyệt giao dịch của chính mình; các nghiệp vụ tài chính phát sinh vượt hạn mức bắt buộc phải do một cán bộ độc lập có thẩm quyền (Checker) phê duyệt.</div>
              </div>
            </div>

            {/* Hai trụ cột thiết lập */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Hai Trụ Cột Quản Trị Hệ Thống
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-xs text-gray-900">
                    Trụ cột 1: Thiết lập vai trò tác nghiệp (Roles & Permissions)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Đường dẫn: <strong>Admin → System → Manage Roles and Permissions</strong>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    Nhấn <strong>+ Add Role</strong> để khởi tạo vai trò tác nghiệp mới. Sau đó cấu hình ma trận phân quyền chi tiết cho từng nhóm nghiệp vụ theo nguyên tắc đặc quyền tối thiểu (Least Privilege).
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px] space-y-1">
                  <div className="font-semibold text-xs text-gray-900">
                    Trụ cột 2: Khởi tạo tài khoản nhân viên (Users Management)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Đường dẫn: <strong>Admin → Users → Manage Users</strong>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    Nhấn <strong>+ Create User</strong> để cấp tài khoản cá nhân cho cán bộ nhân sự. Điền thông tin nhân viên, lựa chọn Office làm việc, gán các Roles phù hợp và thiết lập mật khẩu đăng nhập ban đầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Quy trình thực hành chuẩn bị */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-[2px] space-y-2 text-xs text-amber-900">
              <div className="font-bold text-amber-950">
                Quy trình thực hành tổng quan:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-amber-900/90 pl-1">
                <li>Truy cập <strong>Admin → System → Manage Roles and Permissions</strong>.</li>
                <li>Nhấn <strong>+ Add Role</strong> để tạo vai trò tác nghiệp mới với tên và mô tả chức danh.</li>
                <li>Cấu hình phân quyền chi tiết cho vai trò tác nghiệp.</li>
                <li>Truy cập <strong>Admin → Users → Manage Users</strong>.</li>
                <li>Nhấn <strong>+ Create User</strong> để tạo tài khoản nhân viên làm việc, gán văn phòng và vai trò tương ứng.</li>
                <li>Kiểm tra trạng thái tài khoản kích hoạt thành công trên danh sách Users.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ==========================================================
            BÀI HỌC: FOUNDATION 2: CƠ CẤU TỔ CHỨC
            ========================================================== */}
        {activePartId === 'part-2' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Foundation Setup
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Cấp 1: Tạo Hội sở chính (Head Office)</div>
                <p className="text-gray-600 mt-1">Admin ➔ Organization ➔ Manage Offices ➔ Create Office. Nhập tên Hội sở, Parent Office để trống (Head Office gốc).</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Cấp 2: Tạo Văn phòng khu vực (Bắc - Trung - Nam)</div>
                <p className="text-gray-600 mt-1">Create Office, nhập tên văn phòng khu vực và chọn Parent Office là Hội sở chính vừa tạo.</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Cấp 3: Tạo Chi nhánh (Branches)</div>
                <p className="text-gray-600 mt-1">Create Office, nhập tên Chi nhánh và chọn Parent Office là Văn phòng khu vực quản lý.</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Cấp 4: Tạo Phòng giao dịch (TO)</div>
                <p className="text-gray-600 mt-1">Create Office, nhập tên PGD và chọn Parent Office là Chi nhánh quản lý trực tiếp.</p>
              </div>
            </div>
          </div>
        )}

        {/* Nút hành động ở chân bài học */}
        <div className="pt-2">
          {activePartId === 'gl-part-1' ? (
            isGlPart1Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã hoàn thành 100% Thiết lập đơn vị tiền tệ!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-2')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp (Chart of Accounts) →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetCurrencies) {
                      onResetCurrencies();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-1');
                    }
                  }}
                  className="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px] shadow-2xs cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                  title="Xóa danh sách tiền tệ đã cấu hình và bắt đầu thực hành lại từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Làm lại (Reset tiến trình & data)</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetCurrencies) {
                    onResetCurrencies();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-1');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Phần 1 (Currency)
              </button>
            )
          ) : activePartId === 'gl-part-2' ? (
            isGlPart2Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã thiết lập hoàn tất 5 GL Header cấp 1 (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-3')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: GL Cấp 2 →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetGlHeaders) {
                      onResetGlHeaders();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-2');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại tạo 5 GL Header
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetGlHeaders) {
                    onResetGlHeaders();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-2');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Phần 2 (5 GL Headers)
              </button>
            )
          ) : activePartId === 'gl-part-3' ? (
            isGlPart3Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã thiết lập hoàn tất danh mục GL Cấp 2 (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-4')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: GL Detail →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetGlLevel2) {
                      onResetGlLevel2();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-3');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại tạo GL Cấp 2
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetGlLevel2) {
                    onResetGlLevel2();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-3');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành GL Cấp 2 (5 nhóm)
              </button>
            )
          ) : activePartId === 'gl-part-4' ? (
            isGlPart4Complete ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-5')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: Financial Activity Mapping →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetGlDetails) {
                      onResetGlDetails();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-4');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại tạo GL Detail
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetGlDetails) {
                    onResetGlDetails();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-4');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành GL Detail (5 nhóm)
              </button>
            )
          ) : activePartId === 'gl-part-5' ? (
            isGlPart5Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã thiết lập hoàn tất 6 Financial Activity Mappings (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-6')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: Opening Balance Migration →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetFinancialActivities) {
                      onResetFinancialActivities();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-5');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại Financial Activity Mapping
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetFinancialActivities) {
                    onResetFinancialActivities();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-5');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Financial Activity Mapping (6 liên kết)
              </button>
            )
          ) : activePartId === 'gl-part-6' ? (
            isGlPart6Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã hoàn thành xuất sắc Khởi tạo số dư đầu kỳ & Đối soát Journal Entries (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-7')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: Manual Journal Entries →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetOpeningBalances) {
                      onResetOpeningBalances();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-6');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại Opening Balance Migration
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetOpeningBalances) {
                    onResetOpeningBalances();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-6');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Opening Balance Migration
              </button>
            )
          ) : activePartId === 'gl-part-7' ? (
            isGlPart7Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã hoàn thành xuất sắc Ghi nhận bút toán thủ công & Đối soát Journal Entries (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-8')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: Accounting Rules →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetManualJournal) {
                      onResetManualJournal();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-7');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại Manual Journal Entries
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetManualJournal) {
                    onResetManualJournal();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-7');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Manual Journal Entries
              </button>
            )
          ) : activePartId === 'gl-part-8' ? (
            isGlPart8Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center shadow-xs">
                  <span>Đã hoàn thành xuất sắc Thiết lập Quy tắc định khoản Accounting Rules (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('gl-part-9')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến bài học kế tiếp: Frequent Postings →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetAccountingRules) {
                      onResetAccountingRules();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-8');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại Accounting Rules
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetAccountingRules) {
                    onResetAccountingRules();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-8');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Accounting Rules
              </button>
            )
          ) : activePartId === 'gl-part-9' ? (
            isGlPart9Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center shadow-xs">
                  <span>Đã hoàn thành xuất sắc Ghi nhận bút toán Frequent Postings (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePartId('part-1')}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến phần kế tiếp: User & Access Management →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetFrequentPostings) {
                      onResetFrequentPostings();
                    }
                    if (navigate) {
                      navigate('home');
                    }
                    if (onStartPractice) {
                      onStartPractice('gl-part-9');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại Frequent Postings
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onResetFrequentPostings) {
                    onResetFrequentPostings();
                  }
                  if (navigate) {
                    navigate('home');
                  }
                  if (onStartPractice) {
                    onStartPractice('gl-part-9');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Frequent Postings
              </button>
            )
          ) : activePartId === 'part-1' ? (
            isPart1Complete ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center shadow-xs">
                  <span>Đã hoàn thành xuất sắc Thiết lập Quyền & Nhân viên làm việc (100%)!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onStartPractice) {
                      onStartPractice('part-1');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Luyện tập lại User & Access Management
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onStartPractice) {
                    onStartPractice('part-1');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành User & Access Management
              </button>
            )
          ) : (
            isPart2Complete ? (
              <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                <span>✓</span>
                <span>Đã hoàn thành xuất sắc Foundation 2 (100%)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onStartPractice) {
                    onStartPractice('part-2');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Foundation 2
              </button>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Môi trường học tập Mifos X Edu</span>
        <span className="font-semibold text-gray-700">
          {currentProgress === 100 ? 'Đã hoàn thành 100%' : `Tiến độ: ${currentProgress}%`}
        </span>
      </div>
    </aside>
  );
}
