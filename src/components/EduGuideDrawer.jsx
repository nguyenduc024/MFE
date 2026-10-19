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
  onResetCurrencies,
  onResetGlHeaders,
  onResetGlLevel2,
  onResetGlDetails
}) {
  const [activePartId, setActivePartId] = useState('gl-part-2');
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
  const part1Progress = calculatePart1Progress();
  const part2Progress = calculatePart2Progress();
  
  const currentProgress = 
    activePartId === 'gl-part-1' ? glPart1Progress :
    activePartId === 'gl-part-2' ? glPart2Progress :
    activePartId === 'gl-part-3' ? glPart3Progress :
    activePartId === 'gl-part-4' ? glPart4Progress :
    activePartId === 'part-1' ? part1Progress : part2Progress;

  const isGlPart1Complete = glPart1Progress === 100;
  const isGlPart2Complete = glPart2Progress === 100;
  const isGlPart3Complete = glPart3Progress === 100;
  const isGlPart4Complete = glPart4Progress === 100;
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
                  item.id === 'gl-part-3' ? glPart3Progress : glPart4Progress;

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
                         'Thiết lập 54 tài khoản GL Chi tiết (Detail)'}
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

              {/* Foundation Setup */}
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-t border-b border-gray-100 my-1 bg-gray-50">
                Foundation Setup (Thiết Lập Nền Tảng)
              </div>

              {EDU_MODULES.filter(m => m.moduleNumber === "00").map((item) => {
                const isSelected = item.id === activePartId;
                const itemProgress = item.id === 'part-1' ? part1Progress : part2Progress;

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
                        {item.id === 'part-1' ? 'Thiết lập Role & User ngân hàng' : 'Hội sở, Khu vực, Chi nhánh, PGD (TO)'}
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
            BÀI HỌC: FOUNDATION 1: USER & ROLES
            ========================================================== */}
        {activePartId === 'part-1' && (
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
                <div className="font-semibold text-gray-900">Bước 1: Thiết lập vai trò tác nghiệp (Roles)</div>
                <p className="text-gray-600 mt-1">Truy cập Admin → System → Manage Roles and Permissions, nhấn Add Role để khởi tạo vai trò nghiệp vụ (VD: TKB_TELLER_CASHIER).</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Bước 2: Cấu hình phân quyền chi tiết (Permissions)</div>
                <p className="text-gray-600 mt-1">Thiết lập quyền hạn cụ thể đảm bảo nguyên tắc kiểm soát 4 mắt (Dual Control / Maker - Checker).</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-[2px]">
                <div className="font-semibold text-gray-900">Bước 3: Khởi tạo tài khoản nhân viên (Users)</div>
                <p className="text-gray-600 mt-1">Truy cập Admin → Users, nhấn Create User để tạo tài khoản nhân viên (VD: tkb.teller01) gắn với vai trò tương ứng.</p>
              </div>
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
                <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-[2px] text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <span>✓</span>
                  <span>Đã thiết lập hoàn tất danh mục GL Detail (100%)!</span>
                </div>
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
          ) : activePartId === 'part-1' ? (
            isPart1Complete ? (
              <button
                type="button"
                onClick={() => setActivePartId('part-2')}
                className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Đến bài học kế tiếp →
              </button>
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
                Bắt đầu thực hành
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
