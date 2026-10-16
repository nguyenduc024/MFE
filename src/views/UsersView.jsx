import React, { useState, useMemo } from 'react';
import { 
  Plus, X, ChevronDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Check
} from 'lucide-react';

/**
 * Reusable Floating Label Input for Forms & Filter
 * When empty & unfocused: label sits at input baseline as placeholder.
 * When focused or has value: label smoothly shrinks and floats to the top in primary blue.
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  rightIcon = null
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-0.5 text-[10px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5"
      />
      {rightIcon && (
        <div className="absolute right-0 bottom-1.5 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Select
 */
function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-0.5 text-[10px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <select
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-0 bottom-1.5 pointer-events-none text-gray-400" />
    </div>
  );
}

export default function UsersView({ 
  users = [], 
  offices = [], 
  roles = [], 
  onAddUser, 
  currentUser, 
  onSwitchUser,
  onSelectUser,
  navigate
}) {
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createdSuccessToast, setCreatedSuccessToast] = useState(false);
  const [restrictedModalUser, setRestrictedModalUser] = useState(null);

  const isSystemUser = (u) => {
    return u?.id === '1' || u?.id === '2' || u?.username === 'mifos' || u?.username === 'system';
  };

  // Form State for Create User
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    officeId: '1',
    roleId: roles[0]?.id || '1',
    password: 'Password@123'
  });

  // Filter & Sort Users
  // Mifos X displays 26 active users ordered alphabetically by username ASC
  const filteredUsers = useMemo(() => {
    const text = filterText.toLowerCase().trim();

    return users
      .filter(u => u.enabled !== false && !u.username.includes('DELETED'))
      .filter(u => {
        if (!text) return true;
        return (
          (u.firstname || '').toLowerCase().includes(text) ||
          (u.lastname || '').toLowerCase().includes(text) ||
          (u.email || '').toLowerCase().includes(text) ||
          (u.officeName || '').toLowerCase().includes(text) ||
          (u.username || '').toLowerCase().includes(text)
        );
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [users, filterText]);

  // Pagination calculation
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.firstname.trim() || !formData.lastname.trim()) return;

    const office = offices.find(o => o.id === formData.officeId);
    const role = roles.find(r => r.id === formData.roleId);

    const newUser = {
      id: String(Date.now()),
      username: formData.username.trim(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim() || `${formData.username.trim()}@tkb.org`,
      officeId: formData.officeId,
      officeName: office ? office.name : 'Takashimaya Bank (TKB) - HO',
      roles: role ? [role.name] : ['Viewer'],
      enabled: true
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    setShowAddModal(false);
    setCreatedSuccessToast(true);
    setTimeout(() => setCreatedSuccessToast(false), 3000);

    setFormData({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      officeId: '1',
      roleId: roles[0]?.id || '1',
      password: 'Password@123'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans">
      {/* Toast notification */}
      {createdSuccessToast && (
        <div className="fixed top-16 right-6 z-50 bg-[#28a745] text-white px-4 py-2.5 rounded shadow-lg text-xs flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>User created successfully!</span>
        </div>
      )}

      {/* Header: "Users | Home / Users" on left, "+ Create User" on right */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Users
          </h1>
          <span className="text-gray-300 font-light text-base">|</span>
          <div className="text-xs text-gray-500 font-normal flex items-center space-x-1">
            <span 
              onClick={() => navigate && navigate('home')} 
              className="hover:text-[#1072ba] cursor-pointer"
            >
              Home
            </span>
            <span className="text-gray-400">/</span>
            <span>Users</span>
          </div>
        </div>

        <button
          id="tour-create-user-btn"
          onClick={() => navigate ? navigate('admin-create-user') : setShowAddModal(true)}
          className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filter with animated floating label underline spanning full width */}
      <div className="mb-4">
        <FloatingInput
          label="Filter"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          rightIcon={
            filterText ? (
              <button 
                type="button" 
                onClick={() => {
                  setFilterText('');
                  setCurrentPage(1);
                }}
                className="hover:text-gray-600 cursor-pointer pointer-events-auto"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
        />
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-white">
                <th className="py-3 px-4 text-xs font-semibold text-gray-700">First Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700">Last Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700">Email</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700">Office</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400 text-xs">
                    {filterText ? 'No users found matching filter.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => {
                  const isOdd = idx % 2 === 1;
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <tr 
                      key={u.id || idx} 
                      onClick={() => {
                        if (isSystemUser(u)) {
                          setRestrictedModalUser(u);
                          return;
                        }
                        if (onSelectUser) onSelectUser(u);
                        if (onSwitchUser) onSwitchUser(u);
                        if (navigate) navigate('admin-user-detail');
                      }}
                      className={`cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-sky-50 font-medium' 
                          : isOdd ? 'bg-[#f5f6f8]' : 'bg-white'
                      } hover:bg-[#eef5fa]`}
                      title={`Bấm để xem chi tiết tài khoản: ${u.username}`}
                    >
                      <td className="py-2.5 px-4 text-xs text-gray-800">
                        {u.firstname || u.username}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-800">
                        {u.lastname || ''}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">
                        {u.email || `${u.username}@tkb.org`}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-700">
                        {u.officeName || 'Takashimaya Bank (TKB) - HO'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer: Pagination controls matching screenshot */}
        <div className="flex items-center justify-end space-x-6 py-2.5 px-6 text-xs text-gray-600 select-none border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent pr-4 font-normal text-xs text-gray-800 outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 top-1 pointer-events-none text-gray-500" />
            </div>
          </div>

          <div>
            {totalItems > 0 ? `${startIndex + 1} – ${endIndex} of ${totalItems}` : '0 – 0 of 0'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black cursor-pointer'}`}
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black cursor-pointer'}`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={`p-1 rounded ${currentPage >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black cursor-pointer'}`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className={`p-1 rounded ${currentPage >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black cursor-pointer'}`}
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal with Floating Labels */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
              <h3 className="font-normal text-sm">Create User</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-white hover:opacity-80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  label="First Name *"
                  required
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
                <FloatingInput
                  label="Last Name *"
                  required
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
              </div>

              <FloatingInput
                label="Username *"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />

              <FloatingInput
                label="Email *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <FloatingSelect
                  label="Office *"
                  value={formData.officeId}
                  onChange={(e) => setFormData({ ...formData, officeId: e.target.value })}
                >
                  {offices.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </FloatingSelect>

                <FloatingSelect
                  label="Role *"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </FloatingSelect>
              </div>

              <FloatingInput
                label="Password *"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-[#eaedf1] hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[2px] text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1072ba] hover:bg-[#0e619e] text-white px-4 py-1.5 rounded-[2px] text-xs font-medium shadow-xs cursor-pointer transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restricted System User Modal */}
      {restrictedModalUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-sm w-full p-6 text-gray-800 space-y-3.5 animate-in zoom-in-95">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#e53935]">
              Thao tác không được phép
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              Tài khoản hệ thống mặc định được bảo vệ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tài khoản <strong className="text-gray-900 font-semibold">{restrictedModalUser.username || restrictedModalUser.firstname}</strong> ({restrictedModalUser.firstname} {restrictedModalUser.lastname}) là tài khoản hệ thống mặc định của core banking. Bạn không được phép chỉnh sửa hoặc thao tác trên tài khoản này trong phạm vi bài học.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRestrictedModalUser(null)}
                className="py-1.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
