import React, { useState } from 'react';
import { 
  Globe, Search, Building2, Users, BookOpen, Package, 
  ShieldCheck, ArrowRightLeft, Sparkles, ChevronRight
} from 'lucide-react';
import { MifosBigLogo } from '../components/MifosLogos';

export default function HomeView({ 
  navigate, 
  data, 
  currentUser, 
  toggleEduGuide,
  openUserSwitcher 
}) {
  const [searchActivity, setSearchActivity] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchActivity.trim()) return;
    const query = searchActivity.toLowerCase();

    if (query.includes('office') || query.includes('văn phòng') || query.includes('chi nhánh')) {
      navigate('admin-offices');
    } else if (query.includes('user') || query.includes('người dùng') || query.includes('tài khoản')) {
      navigate('admin-users');
    } else if (query.includes('role') || query.includes('quyền') || query.includes('maker')) {
      navigate('admin-roles');
    } else if (query.includes('coa') || query.includes('kế toán') || query.includes('tài khoản gl')) {
      navigate('accounting-coa');
    } else if (query.includes('loan') || query.includes('vay')) {
      navigate('admin-loan-products');
    } else if (query.includes('client') || query.includes('khách')) {
      navigate('clients');
    } else {
      navigate('clients', { searchQuery: searchActivity });
    }
  };

  const coreModules = [
    { num: "01", name: "Cơ Cấu Tổ Chức & Tiền Mặt", path: "admin-offices", icon: Building2, desc: "30 Chi nhánh (TKB) & Quầy Thủ Đức" },
    { num: "02", name: "Người Dùng & Phân Quyền", path: "admin-users", icon: ShieldCheck, desc: "27 Users & 16 Roles Maker-Checker" },
    { num: "03", name: "Kế Toán Sổ Cái (COA)", path: "accounting-coa", icon: BookOpen, desc: "70 Tài khoản GL & 75 bút toán" },
    { num: "04", name: "Sản Phẩm Tín Dụng & Tiết Kiệm", path: "admin-loan-products", icon: Package, desc: "TKB Personal Loan & 3 gói tiền gửi" },
    { num: "05", name: "Hồ Sơ Khách Hàng (CIF)", path: "clients", icon: Users, desc: "12 Khách hàng định danh" },
    { num: "06", name: "Vận Hành Cho Vay & Thu Nợ", path: "clients", icon: ArrowRightLeft, desc: "Khoản vay #000000001 & Thu nợ" },
  ];

  return (
    <div className="w-full px-6 py-5 select-none animate-in fade-in duration-150">
      {/* Top Header Row: Title "Home" on left, Blue "Dashboard" button on right */}
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <h1 className="text-xl font-normal text-[#333333] tracking-tight">
          Home
        </h1>

        <button
          onClick={() => navigate('admin')}
          className="mifos-btn-blue px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Center Welcome Card (Matches Screenshot Exactly) */}
      <div className="max-w-xl mx-auto">
        <div className="mifos-card p-8 bg-white text-left transition-all">
          {/* Welcome User Greeting */}
          <h2 className="text-base font-semibold text-[#333333] mb-6">
            Welcome, {currentUser?.username || 'mifos'}!
          </h2>

          {/* Search Activity with bottom border / underline */}
          <form onSubmit={handleSearchSubmit} className="mb-8">
            <div className="relative border-b border-gray-300 focus-within:border-[#1072ba] transition-colors pb-1">
              <input
                type="text"
                value={searchActivity}
                onChange={(e) => setSearchActivity(e.target.value)}
                placeholder="Search Activity"
                className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent outline-none py-1 pr-6"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
            </div>
          </form>

          {/* Official Big Mifos Logo with Segmented Globe */}
          <div className="py-6 flex items-center justify-center">
            <MifosBigLogo className="h-24 w-auto" />
          </div>
        </div>

        {/* Quick Access to the 6 Core Modules of the Assignment */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
            <span>6 Phân Hệ Thiết Lập Trong Bài Tập Core Banking (TKB)</span>
            <button
              onClick={toggleEduGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-[#1072ba] bg-sky-50 hover:bg-sky-100/70 text-[#1072ba] font-medium transition-colors cursor-pointer text-xs"
              title="Mở Sổ tay thực hành Configuration Wizard"
            >
              <span>Configuration Wizard</span>
              <span className="bg-[#28a745] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] uppercase tracking-wide">
                Thực hành
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {coreModules.map((m) => {
              const ModIcon = m.icon;
              return (
                <button
                  key={m.num}
                  onClick={() => navigate(m.path)}
                  className="mifos-card p-3 text-left hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#1072ba] bg-sky-50 px-1.5 py-0.2 rounded">
                      PHÂN HỆ {m.num}
                    </span>
                    <ModIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1072ba] transition-colors" />
                  </div>
                  <div className="text-xs font-semibold text-gray-800 group-hover:text-[#1072ba] transition-colors leading-snug truncate">
                    {m.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">
                    {m.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
