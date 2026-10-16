import React from 'react';
import { 
  Gauge, Send, Check, Database, Bell, RotateCw, 
  Plus, GitBranch, Calculator, HelpCircle, User, 
  LayoutGrid, BookOpen, Building2, ShieldCheck, 
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ 
  collapsed, 
  currentPath, 
  navigate, 
  openUserSwitcher, 
  toggleEduGuide,
  currentUser 
}) {
  if (collapsed) return null;

  const mainNavItems = [
    { id: 'home', icon: Gauge, tooltip: 'Dashboard (Trang chủ)', path: 'home' },
    { id: 'clients', icon: Send, tooltip: 'Clients & Transfers (Khách hàng & Giao dịch)', path: 'clients' },
    { id: 'checker', icon: Check, tooltip: 'Checker Inbox & Approvals (Phê duyệt hồ sơ)', action: openUserSwitcher },
    { id: 'accounting-coa', icon: Database, tooltip: 'Chart of Accounts (Hệ thống tài khoản GL)', path: 'accounting-coa' },
    { id: 'tasks', icon: Bell, tooltip: 'Notifications & Alerts', action: () => alert('Hệ thống đang hoạt động bình thường, không có cảnh báo.') },
    { id: 'jobs', icon: RotateCw, tooltip: 'Scheduler Jobs & Batch History', path: 'accounting-journal' },
    { id: 'create', icon: Plus, tooltip: 'Quick Create (Tạo nhanh hồ sơ/văn phòng)', path: 'clients' },
    { id: 'admin-offices', icon: GitBranch, tooltip: 'Manage Offices (Cây phân cấp 30 văn phòng)', path: 'admin-offices' },
    { id: 'admin-tellers', icon: Calculator, tooltip: 'Cash Management (Tellers & Quầy thu ngân)', path: 'admin-tellers' },
    { id: 'guide', icon: HelpCircle, tooltip: 'Sổ Tay Hướng Dẫn Bài Tập 6 Phân Hệ', action: toggleEduGuide },
  ];

  return (
    <aside className="mifos-sidebar w-12 flex-shrink-0 flex flex-col items-center py-2 text-gray-700 select-none z-30 min-h-[calc(100vh-48px)]">
      {/* Top Profile / Badge Section (Matches screenshot) */}
      <div className="flex flex-col items-center space-y-1 pb-2 mb-2 w-full px-1.5 border-b border-gray-100">
        <button
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded flex items-center justify-center text-gray-600 hover:text-sky-700 hover:bg-gray-100 transition-colors"
          title="Home Dashboard"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <button
          onClick={openUserSwitcher}
          className="w-9 h-9 rounded flex items-center justify-center text-gray-600 hover:text-sky-700 hover:bg-gray-100 transition-colors"
          title={`Tài khoản: ${currentUser?.username || 'mifos'} (Đổi User)`}
        >
          <User className="w-4 h-4" />
        </button>
      </div>

      {/* Main Action Icons List */}
      <div className="flex flex-col items-center space-y-1.5 w-full px-1.5 flex-1">
        {mainNavItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-sky-50 text-sky-700 font-bold' 
                  : 'text-gray-600 hover:text-sky-700 hover:bg-gray-100'
              }`}
              title={item.tooltip}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
