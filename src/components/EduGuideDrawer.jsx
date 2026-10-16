import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EDU_MODULES } from '../data/mifosData';

export default function EduGuideDrawer({ 
  isOpen, 
  onClose, 
  navigate, 
  onStartPractice,
  roles = [],
  users = []
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

  // Tiến độ Phần 2: Cơ Cấu Tổ Chức (Hội sở, Chi nhánh, TO) - Để trống chưa thêm gì
  const calculatePart2Progress = () => 0;

  const currentModule = EDU_MODULES.find(m => m.id === activePartId) || EDU_MODULES[0];
  const part1Progress = calculatePart1Progress();
  const currentProgress = activePartId === 'part-1' ? part1Progress : calculatePart2Progress();
  const isPart1Complete = part1Progress === 100;

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
                const itemProgress = item.id === 'part-1' ? part1Progress : calculatePart2Progress();

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
                        {item.id === 'part-1' ? 'Thiết lập Role & User ngân hàng' : 'Hội sở, Chi nhánh, Phòng giao dịch'}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {item.id === 'part-1' ? (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          itemProgress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-[#1072ba]'
                        }`}>
                          {itemProgress}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          0%
                        </span>
                      )}
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
          /* Phần 2: Cơ cấu tổ chức (Hội sở, Chi nhánh, TO) - Để trống theo yêu cầu */
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Phân hệ 01: Cơ Cấu Tổ Chức
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                {currentModule.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {currentModule.objective}
              </p>
            </div>

            {/* Để trống nội dung bài học theo yêu cầu */}
            <div className="py-16 text-center text-gray-400 space-y-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500">
                Nội dung thực hành Phần 2 đang để trống
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                (Phần này sẽ xây dựng luồng thực hành tạo Hội sở chính, Chi nhánh khu vực và Phòng giao dịch TO sau).
              </p>
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
                    onStartPractice();
                  }
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Bắt đầu thực hành
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-4 bg-gray-200 text-gray-400 text-xs font-semibold rounded-[2px] cursor-not-allowed text-center"
            >
              Chưa bắt đầu thực hành
            </button>
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
