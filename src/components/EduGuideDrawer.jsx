import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EDU_MODULES } from '../data/mifosData';

export default function EduGuideDrawer({ 
  isOpen, 
  onClose, 
  navigate, 
  onStartPractice,
  roles = [],
  users = [],
  offices = []
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

  // Tính toán tiến độ Phần 1: User & Access Management (4 mốc x 25% = 100%)
  const calculatePart1Progress = () => {
    let score = 0;
    if (roles.length > 2) score += 25;      // 1. Đã tạo vai trò đầu tiên (TKB_TELLER_CASHIER)
    if (roles.length >= 16) score += 25;    // 2. Đã nạp đủ 16 vai trò chuẩn từ database
    if (users.length > 2) score += 25;      // 3. Đã tạo tài khoản nhân viên đầu tiên (tkb.teller01)
    if (users.length >= 26) score += 25;    // 4. Đã nạp đủ 26 tài khoản nhân sự từ database
    return score;
  };

  // Tính toán tiến độ Phần 2: Cơ Cấu Tổ Chức (4 mốc x 25% = 100%)
  const calculatePart2Progress = () => {
    let score = 0;
    // 1. Bước 1: Đã tạo Hội sở chính (Head Office)
    const hasHO = offices.some(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
    if (hasHO) score += 25;

    // 2. Bước 2: Đã tạo Văn phòng khu vực (Bắc / Trung / Nam có parent là HO)
    const hasRO = offices.some(o => {
      if (!o.parentId || o.parentId === 'none' || o.parentId === 'root') return false;
      const parent = offices.find(p => String(p.id) === String(o.parentId));
      return (parent && (!parent.parentId || parent.parentId === 'none' || parent.parentId === 'root')) ||
        o.name.toLowerCase().includes('region') ||
        o.name.toLowerCase().includes('khu vực');
    });
    if (hasRO) score += 25;

    // 3. Bước 3: Đã tạo Chi nhánh (Branch có parent là Regional Office)
    const hasBranch = offices.some(o => {
      return o.name.toLowerCase().includes('branch') || o.name.toLowerCase().includes('chi nhánh');
    });
    if (hasBranch) score += 25;

    // 4. Bước 4: Đã tạo Phòng giao dịch (TO có parent là Branch)
    const hasTO = offices.some(o => {
      return o.name.toLowerCase().includes('transaction office') ||
        o.name.toLowerCase().includes('phòng giao dịch') ||
        (o.externalId && o.externalId.toLowerCase().includes('-to-'));
    });
    if (hasTO) score += 25;

    return score;
  };

  const currentModule = EDU_MODULES.find(m => m.id === activePartId) || EDU_MODULES[0];
  const part1Progress = calculatePart1Progress();
  const part2Progress = calculatePart2Progress();
  const currentProgress = activePartId === 'part-1' ? part1Progress : part2Progress;
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
            <div className="absolute left-0 top-9 w-72 bg-white text-gray-800 rounded-[2px] shadow-xl py-1.5 z-50 text-xs border border-gray-100 animate-in fade-in duration-100">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                Danh sách bài học Phân hệ 01
              </div>

              {EDU_MODULES.map((item) => {
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
        {activePartId === 'part-1' ? (
          <>
            {/* Tiêu đề & Mục tiêu Phần 1 */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: User & Access Management
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Tóm tắt các bước thực hành Phần 1 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Tóm tắt các bước thực hành
              </h4>

              <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
                <div>
                  <div className="font-semibold text-gray-900">
                    Bước 1: Thiết lập vai trò tác nghiệp (Roles)
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Truy cập Admin → System → Manage Roles and Permissions, nhấn Add Role để khởi tạo các vai trò nghiệp vụ của ngân hàng (ví dụ: TKB_TELLER_CASHIER, TKB_LOAN_OFFICER, TKB_ACCOUNTING_MAKER...).
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-gray-900">
                    Bước 2: Cấu hình phân quyền chi tiết (Permissions)
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Thiết lập quyền hạn cụ thể cho từng vai trò nhằm tuân thủ nguyên tắc kiểm soát 4 mắt (Maker - Checker), tách biệt người khởi tạo và người phê duyệt.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-gray-900">
                    Bước 3: Tạo tài khoản người dùng (Create User)
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Truy cập Admin → Users, nhấn Create User để cấp tài khoản cho cán bộ nhân viên, phân bổ đơn vị công tác (Office) và gán vai trò tương ứng đã tạo.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-gray-900">
                    Bước 4: Xác thực và quản trị tài khoản
                  </div>
                  <p className="text-gray-600 mt-0.5">
                    Kiểm tra thông tin chi tiết hồ sơ nhân viên trên màn hình User Detail, kích hoạt hoặc quản lý mật khẩu để sẵn sàng vận hành.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Phần 2: Cơ cấu tổ chức (Hội sở, Chi nhánh, TO) */
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Cơ Cấu Tổ Chức & Mạng Lưới Hoạt Động
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Sơ đồ Cây Phân Cấp Trực Quan 4 Cấp */}
            <div className="bg-sky-50/60 border border-sky-100 rounded-[2px] p-4 text-xs space-y-2">
              <div className="font-bold text-[#1072ba] uppercase text-[11px] tracking-wider flex items-center justify-between">
                <span>Mô hình 4 cấp mạng lưới ngân hàng:</span>
                <span className="text-gray-500 font-normal lowercase">Parent Office Flow</span>
              </div>
              <div className="font-mono text-[11px] bg-white p-3 rounded border border-sky-100 text-gray-700 leading-relaxed overflow-x-auto">
                <div className="font-bold text-sky-900">🏛️ Cấp 1: Hội sở chính (Head Office - HO)</div>
                <div className="text-gray-400 pl-4">└── Parent = (None / Root)</div>
                <div className="font-bold text-sky-800 pl-4 mt-1">🏢 Cấp 2: Văn phòng khu vực (Bắc / Trung / Nam)</div>
                <div className="text-gray-400 pl-8">└── Parent = Hội sở chính (HO)</div>
                <div className="font-bold text-sky-700 pl-8 mt-1">🏦 Cấp 3: Chi nhánh (Branch: Hà Nội, TP.HCM, Đà Nẵng...)</div>
                <div className="text-gray-400 pl-12">└── Parent = Văn phòng khu vực (RO)</div>
                <div className="font-bold text-sky-600 pl-12 mt-1">🏪 Cấp 4: Phòng giao dịch (Transaction Office - TO)</div>
                <div className="text-gray-400 pl-16">└── Parent = Chi nhánh (Branch)</div>
              </div>
            </div>

            {/* Chi tiết 4 Bước thực hành Phần 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Luồng thao tác thực hành chuẩn:
              </h4>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                {/* Bước 1: Tạo Hội sở */}
                <div className="border border-gray-100 p-3.5 rounded bg-gray-50/60">
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span>Bước 1: Tạo Hội sở chính (Head Office)</span>
                    <span className="text-[10px] text-sky-700 font-medium bg-sky-100 px-1.5 py-0.5 rounded">Cấp 1</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Đường dẫn: <strong className="text-gray-900">Admin → Organization → Manage Offices → Create Office</strong>.
                  </p>
                  <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-gray-600 text-[11px]">
                    <li><strong>Office *</strong>: Nhập tên Hội sở (VD: <code className="bg-white px-1 py-0.5 border rounded">Takashimaya Bank (TKB) - HO</code>).</li>
                    <li><strong>Parent Office *</strong>: Chọn <code className="bg-white px-1 py-0.5 border rounded">(None / Root - Hội sở chính)</code>.</li>
                    <li><strong>Opened On *</strong>: 01/08/2026. External ID: <code className="bg-white px-1 py-0.5 border rounded">TKB - HO - 001</code>.</li>
                  </ul>
                </div>

                {/* Bước 2: Tạo Văn phòng khu vực */}
                <div className="border border-gray-100 p-3.5 rounded bg-gray-50/60">
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span>Bước 2: Tạo Văn phòng khu vực (Bắc, Trung, Nam)</span>
                    <span className="text-[10px] text-sky-700 font-medium bg-sky-100 px-1.5 py-0.5 rounded">Cấp 2</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Đường dẫn: Tương tự truy cập <strong className="text-gray-900">Create Office</strong>. Khởi tạo 3 trung tâm khu vực miền (Miền Bắc, Miền Trung, Miền Nam).
                  </p>
                  <div className="mt-1.5 p-2 bg-amber-50/80 border border-amber-200/60 rounded text-[11px] text-amber-900">
                    <strong>Thao tác then chốt:</strong> Tại trường <strong>Parent Office *</strong>, bắt buộc chọn <strong>Hội sở chính vừa tạo</strong> ở Bước 1 (<code className="bg-white px-1 py-0.5 border rounded">Takashimaya Bank (TKB) - HO</code>) rồi nhấn Submit.
                  </div>
                </div>

                {/* Bước 3: Tạo Chi nhánh */}
                <div className="border border-gray-100 p-3.5 rounded bg-gray-50/60">
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span>Bước 3: Tạo Chi nhánh (Branches)</span>
                    <span className="text-[10px] text-sky-700 font-medium bg-sky-100 px-1.5 py-0.5 rounded">Cấp 3</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Đường dẫn: Tương tự nhấn <strong className="text-gray-900">Create Office</strong>, nhập tên Chi nhánh (VD: <code className="bg-white px-1 py-0.5 border rounded">Hanoi Branch</code>, <code className="bg-white px-1 py-0.5 border rounded">Hochiminh Branch</code>...).
                  </p>
                  <div className="mt-1.5 p-2 bg-sky-50/80 border border-sky-200/60 rounded text-[11px] text-sky-900">
                    <strong>Thao tác then chốt:</strong> Tại trường <strong>Parent Office *</strong>, chọn <strong>Văn phòng khu vực miền tương ứng</strong> (VD: Chi nhánh Hà Nội chọn Parent là <code className="bg-white px-1 py-0.5 border rounded">TKB - Northern Region Office</code>).
                  </div>
                </div>

                {/* Bước 4: Tạo Phòng giao dịch */}
                <div className="border border-gray-100 p-3.5 rounded bg-gray-50/60">
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span>Bước 4: Tạo Phòng giao dịch (Transaction Office - TO)</span>
                    <span className="text-[10px] text-sky-700 font-medium bg-sky-100 px-1.5 py-0.5 rounded">Cấp 4</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Đường dẫn: Tương tự nhấn <strong className="text-gray-900">Create Office</strong>, nhập tên Phòng giao dịch (VD: <code className="bg-white px-1 py-0.5 border rounded">Cau Giay Transaction Office</code>, <code className="bg-white px-1 py-0.5 border rounded">Thu Duc Transaction Office</code>...).
                  </p>
                  <div className="mt-1.5 p-2 bg-emerald-50/80 border border-emerald-200/60 rounded text-[11px] text-emerald-900">
                    <strong>Khác biệt quan trọng:</strong> Khác với 2 cấp trên, trường <strong>Parent Office *</strong> của Phòng giao dịch phải chọn <strong>Chi nhánh trực tiếp quản lý</strong> (VD: PGD Cầu Giấy chọn Parent là <code className="bg-white px-1 py-0.5 border rounded">Hanoi Branch</code>).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div className="pt-2">
          {activePartId === 'part-1' ? (
            isPart1Complete ? (
              /* Khi tiến độ Phần 1 đạt 100% -> Chuyển thành nút Đến bài học kế tiếp */
              <button
                onClick={() => setActivePartId('part-2')}
                className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Đến bài học kế tiếp →
              </button>
            ) : (
              <button
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
                <span>Đã hoàn thành xuất sắc Phần 2 (100%)</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onStartPractice) {
                    onStartPractice('part-2');
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành Phần 2
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
