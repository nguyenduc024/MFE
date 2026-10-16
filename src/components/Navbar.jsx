import React, { useState, useEffect, useRef } from 'react';
import { 
  Landmark, BookOpen, BarChart3, Shield, Users, 
  Info, Search, Bell, CheckSquare, ChevronRight, ChevronDown,
  User
} from 'lucide-react';
import { MifosXIcon } from './MifosLogos';

export default function Navbar({ 
  currentPath, 
  navigate, 
  currentUser, 
  openUserSwitcher, 
  toggleEduGuide, 
  eduGuideOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'institution', 'accounting', 'reports', 'admin', 'selfService', 'language'
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const navRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('clients', { searchQuery });
      setSearchOpen(false);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
    setActiveSubmenu(null);
  };

  const handleItemClick = (path) => {
    if (path) navigate(path);
    setOpenDropdown(null);
    setActiveSubmenu(null);
  };

  return (
    <header ref={navRef} className="mifos-header h-12 w-full flex items-center justify-between text-white select-none z-50 sticky top-0">
      {/* Left: Chevron Toggle + Navigation Menus */}
      <div className="flex items-center h-full">
        {/* Sidebar Toggle Chevron (Starts at very left edge, matching screenshot) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="px-3 h-full flex items-center justify-center text-white/90 hover:bg-black/10 transition-colors text-sm"
          title="Toggle Navigation Sidebar"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Top Navigation Menu Items */}
        <nav className="hidden md:flex items-center h-full space-x-0.5 text-xs">
          {/* 1. Institution Dropdown (Exact match to Image 1) */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => toggleDropdown('institution')}
              className={`mifos-header-item h-9 ${openDropdown === 'institution' ? 'active' : ''}`}
            >
              <Landmark className="w-4 h-4" />
              <span>Institution</span>
            </button>

            {openDropdown === 'institution' && (
              <div 
                className="absolute left-0 top-11 w-44 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px] font-normal"
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <div 
                  onClick={() => handleItemClick('clients')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333]"
                >
                  Clients
                </div>
                <div 
                  onClick={() => handleItemClick('clients')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333]"
                >
                  Groups
                </div>
                <div 
                  onClick={() => handleItemClick('clients')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333]"
                >
                  Centers
                </div>
                <div 
                  onClick={() => handleItemClick('accounting-coa')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333]"
                >
                  Accounting
                </div>

                {/* Reports Submenu Item */}
                <div 
                  className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333] flex items-center justify-between"
                  onMouseEnter={() => setActiveSubmenu('inst-reports')}
                  onClick={() => handleItemClick('reports')}
                >
                  <span>Reports</span>
                  <span className="text-gray-500 text-xs">▸</span>

                  {activeSubmenu === 'inst-reports' && (
                    <div className="absolute left-full top-0 w-36 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px]">
                      {['All', 'Clients', 'Loans', 'Savings', 'Funds', 'Accounting', 'XBRL'].map((item) => (
                        <div 
                          key={item} 
                          onClick={(e) => { e.stopPropagation(); handleItemClick(item === 'Accounting' ? 'accounting-journal' : 'reports'); }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Submenu Item */}
                <div 
                  className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333] flex items-center justify-between"
                  onMouseEnter={() => setActiveSubmenu('inst-admin')}
                  onClick={() => handleItemClick('admin')}
                >
                  <span>Admin</span>
                  <span className="text-gray-500 text-xs">▸</span>

                  {activeSubmenu === 'inst-admin' && (
                    <div className="absolute left-full top-0 w-40 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px]">
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin-users'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Users</div>
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin-organization'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Organization</div>
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin-system'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">System</div>
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin-loan-products'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Products</div>
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Templates</div>
                    </div>
                  )}
                </div>

                {/* Self Service Submenu Item */}
                <div 
                  className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#333333] flex items-center justify-between"
                  onMouseEnter={() => setActiveSubmenu('inst-self')}
                  onClick={() => handleItemClick('admin-users')}
                >
                  <span>Self Service</span>
                  <span className="text-gray-500 text-xs">▸</span>

                  {activeSubmenu === 'inst-self' && (
                    <div className="absolute left-full top-0 w-48 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px]">
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin-users'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">User Management</div>
                      <div onClick={(e) => { e.stopPropagation(); handleItemClick('admin'); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">App Configuration</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Accounting Dropdown */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => toggleDropdown('accounting')}
              className={`mifos-header-item h-9 ${openDropdown === 'accounting' ? 'active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Accounting</span>
            </button>

            {openDropdown === 'accounting' && (
              <div className="absolute left-0 top-11 w-56 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px] font-normal">
                <div onClick={() => handleItemClick('accounting-journal')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Frequent Postings
                </div>
                <div onClick={() => handleItemClick('accounting-coa')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Chart of Accounts
                </div>
                <div onClick={() => handleItemClick('accounting-activities')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Financial Activity Mappings
                </div>
                <div onClick={() => handleItemClick('accounting-rules')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Accruals
                </div>
                <div onClick={() => handleItemClick('accounting-closure')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Closing Entries
                </div>
                <div onClick={() => handleItemClick('accounting-rules')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Accounting Rules
                </div>
                <div onClick={() => handleItemClick('accounting-journal')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Search Journal Entries
                </div>
              </div>
            )}
          </div>

          {/* 3. Reports Dropdown (Exact match to Image 2) */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => toggleDropdown('reports')}
              className={`mifos-header-item h-9 ${openDropdown === 'reports' ? 'active' : ''}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            {openDropdown === 'reports' && (
              <div className="absolute left-0 top-11 w-36 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px] font-normal">
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  All
                </div>
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Clients
                </div>
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Loans
                </div>
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Savings
                </div>
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Funds
                </div>
                <div onClick={() => handleItemClick('accounting-journal')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Accounting
                </div>
                <div onClick={() => handleItemClick('reports')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  XBRL
                </div>
              </div>
            )}
          </div>

          {/* 4. Admin Dropdown (Exact match to Image 3) */}
          <div className="relative h-full flex items-center">
            <button
              id="tour-nav-admin"
              onClick={() => toggleDropdown('admin')}
              className={`mifos-header-item h-9 ${openDropdown === 'admin' ? 'active' : ''}`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            {openDropdown === 'admin' && (
              <div className="absolute left-0 top-11 w-40 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px] font-normal">
                <div 
                  id="tour-admin-users" 
                  onClick={() => handleItemClick('admin-users')} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Users
                </div>
                <div onClick={() => handleItemClick('admin-organization')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Organization
                </div>
                <div 
                  id="tour-admin-system" 
                  onClick={() => handleItemClick('admin-system')} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  System
                </div>
                <div onClick={() => handleItemClick('admin-loan-products')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Products
                </div>
                <div onClick={() => handleItemClick('admin')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Templates
                </div>
              </div>
            )}
          </div>

          {/* 5. Self Service Dropdown (Exact match to Image 4) */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => toggleDropdown('selfService')}
              className={`mifos-header-item h-9 ${openDropdown === 'selfService' ? 'active' : ''}`}
            >
              <Users className="w-4 h-4" />
              <span>Self Service</span>
            </button>

            {openDropdown === 'selfService' && (
              <div className="absolute left-0 top-11 w-48 bg-white text-gray-800 rounded shadow-md py-1.5 z-50 text-[13px] font-normal">
                <div onClick={() => handleItemClick('admin-users')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  User Management
                </div>
                <div onClick={() => handleItemClick('admin')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  App Configuration
                </div>
              </div>
            )}
          </div>

          {/* 6. Configuration Wizard with highlighted border & practice badge */}
          <button
            onClick={toggleEduGuide}
            className={`h-8.5 px-3 rounded-[2px] flex items-center gap-2 border transition-all cursor-pointer text-xs font-medium select-none shadow-xs ${
              eduGuideOpen
                ? 'bg-white text-[#1072ba] border-white font-semibold shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white border-amber-300 hover:border-amber-200'
            }`}
            title="Configuration Wizard — Bấm vào đây để mở sổ tay thực hành"
          >
            <Info className={`w-3.5 h-3.5 ${eduGuideOpen ? 'text-[#1072ba]' : 'text-amber-300'}`} />
            <span>Configuration Wizard</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider ${
              eduGuideOpen
                ? 'bg-[#1072ba] text-white'
                : 'bg-[#28a745] text-white'
            }`}>
              Thực hành
            </span>
          </button>
        </nav>
      </div>

      {/* Right: Search, Language, Notifications, User Profile */}
      <div className="flex items-center space-x-2 pr-3 text-xs">
        {/* Search button / input */}
        <div className="relative flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-2.5 py-1 text-xs bg-white text-gray-900 rounded outline-none shadow-xs w-44 font-normal"
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
            </form>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-white"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Language Selector ("Language English ▾") */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('language')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-white/10 rounded text-[11px] text-white font-medium"
          >
            <span className="text-white/80">Language</span>
            <span className="underline font-semibold ml-0.5">{currentLanguage}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {openDropdown === 'language' && (
            <div 
              className="absolute right-0 top-9 w-32 bg-white text-gray-800 rounded shadow-md py-1 z-50 text-[13px]"
            >
              <div 
                onClick={() => { setCurrentLanguage('English'); setOpenDropdown(null); }}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                English
              </div>
              <div 
                onClick={() => { setCurrentLanguage('Tiếng Việt'); setOpenDropdown(null); }}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
              >
                Tiếng Việt
              </div>
            </div>
          )}
        </div>

        {/* Bell Notification Icon */}
        <button 
          onClick={() => alert("Không có thông báo mới.")}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-white relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Action / Checklist Icon */}
        <button 
          onClick={openUserSwitcher}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-white"
          title="Checker Inbox & Tasks"
        >
          <CheckSquare className="w-4 h-4" />
        </button>

        {/* User Profile Silhouette Icon */}
        <button 
          onClick={openUserSwitcher}
          className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/40 flex items-center justify-center text-white transition-colors ml-1 shadow-xs"
          title={`Đang đăng nhập: ${currentUser?.username || 'mifos'} (Bấm để đổi user)`}
        >
          <User className="w-4 h-4 fill-white" />
        </button>
      </div>
    </header>
  );
}
