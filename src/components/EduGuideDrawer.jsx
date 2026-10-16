import React, { useState } from 'react';
import { EDU_MODULES } from '../data/mifosData';

export default function EduGuideDrawer({ 
  isOpen, 
  onClose, 
  navigate, 
  onStartPractice,
  roles = [],
  users = []
}) {
  const [activeModuleId, setActiveModuleId] = useState('mod-1');

  if (!isOpen) return null;

  const currentModule = EDU_MODULES.find(m => m.id === activeModuleId) || EDU_MODULES[0];

  // Tính toán tiến độ Phân hệ 01: User & Access Management (4 mốc x 25% = 100%)
  const calculateProgress = () => {
    let score = 0;
    if (roles.length > 2) score += 25;      // 1. Đã tạo vai trò đầu tiên (TKB_TELLER_CASHIER)
    if (roles.length >= 16) score += 25;    // 2. Đã nạp đủ 16 vai trò chuẩn từ database
    if (users.length > 2) score += 25;      // 3. Đã tạo tài khoản nhân viên đầu tiên (tkb.teller01)
    if (users.length >= 26) score += 25;    // 4. Đã nạp đủ 26 tài khoản nhân sự từ database
    return score;
  };

  const progress = calculateProgress();

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

      {/* Module Selector & Thanh đo tiến độ (Vị trí vạch đỏ) */}
      <div className="bg-[#0e619e] px-5 py-2 flex items-center justify-between gap-3">
        <div className="shrink-0">
          <span className="text-xs font-bold px-3 py-1 rounded-[2px] bg-white text-[#1072ba] inline-block shadow-xs">
            Phân hệ 01
          </span>
        </div>

        {/* Thanh đo tiến độ */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0" title={`Tiến độ hoàn thành: ${progress}%`}>
          <div className="flex-1 bg-black/25 h-2 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full rounded-full bg-[#28a745] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-white shrink-0 font-mono tracking-tight">
            {progress}%
          </span>
        </div>
      </div>

      {/* Module Content Body - Pure white, NO decorative boxes, NO borders for text */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-gray-800 text-xs bg-white">
        {/* Badge Phân hệ 1 & Tiêu đề */}
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

        {/* Tóm tắt các bước thực hành - Pure plain typography */}
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

        {/* Nút Bắt đầu thực hành */}
        <div className="pt-2">
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
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Môi trường học tập Mifos X Edu</span>
        <span className="font-semibold text-gray-700">
          {progress === 100 ? 'Đã hoàn thành 100%' : `Tiến độ: ${progress}%`}
        </span>
      </div>
    </aside>
  );
}
