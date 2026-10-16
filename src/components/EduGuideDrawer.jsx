import React, { useState } from 'react';
import { EDU_MODULES } from '../data/mifosData';

export default function EduGuideDrawer({ 
  isOpen, 
  onClose, 
  navigate, 
  onStartPractice,
  onResetPractice 
}) {
  const [activeModuleId, setActiveModuleId] = useState('mod-1');
  const [resetToast, setResetToast] = useState('');

  if (!isOpen) return null;

  const currentModule = EDU_MODULES.find(m => m.id === activeModuleId) || EDU_MODULES[0];

  const handleReset = () => {
    if (onResetPractice) {
      onResetPractice();
    }
    setResetToast('Đã đặt lại dữ liệu thực hành về ban đầu.');
    setTimeout(() => setResetToast(''), 3000);
  };

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

      {/* Module Selector - Plain text tabs, no icons */}
      <div className="bg-[#0e619e] px-5 py-2 flex space-x-2">
        {EDU_MODULES.map((mod) => {
          const isSelected = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              className={`text-xs font-semibold px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#1072ba] font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Phân hệ {mod.number}
            </button>
          );
        })}
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

        {/* Nút Làm lại & Bắt đầu thực hành */}
        <div className="pt-2 space-y-2">
          {resetToast && (
            <div className="text-[11px] text-[#28a745] font-medium text-center animate-in fade-in">
              {resetToast}
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="w-1/3 py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors text-center"
              title="Đặt lại toàn bộ dữ liệu thực hành về ban đầu"
            >
              Làm lại
            </button>
            <button
              onClick={() => {
                if (onStartPractice) {
                  onStartPractice();
                }
              }}
              className="w-2/3 py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Bắt đầu thực hành
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Môi trường học tập Mifos X Edu</span>
        <button
          onClick={() => {
            const nextIdx = (EDU_MODULES.findIndex(m => m.id === activeModuleId) + 1) % EDU_MODULES.length;
            setActiveModuleId(EDU_MODULES[nextIdx].id);
          }}
          className="font-medium text-[#1072ba] hover:underline cursor-pointer"
        >
          Bài tiếp theo
        </button>
      </div>
    </aside>
  );
}
