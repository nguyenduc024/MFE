import React, { useState } from 'react';
import { X, Check, Search, Shield, User, Building } from 'lucide-react';

export default function UserSwitcherModal({ isOpen, onClose, users = [], currentUser, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  if (!isOpen) return null;

  const rolesList = ['All', 'MAKER', 'CHECKER', 'APPROVER', 'TELLER', 'ADMIN', 'OFFICER'];

  const allUsers = [
    ...(currentUser && !users.some(u => u.id === currentUser.id) ? [currentUser] : []),
    ...users
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.firstname + ' ' + u.lastname).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.roles || []).some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterRole === 'All') return matchSearch;
    return matchSearch && (u.roles || []).some(r => r.toUpperCase().includes(filterRole));
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Chuyển Đổi Tài Khoản / Vai Trò (Maker - Checker)
            </h3>
            <p className="text-xs text-sky-200 mt-0.5">
              Chọn tài khoản người dùng để mô phỏng phân quyền nghiệp vụ (Maker - Checker)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-sky-200 hover:text-white rounded p-1 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo username, tên nhân viên, vai trò..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded border border-gray-300 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {rolesList.map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
                  filterRole === role 
                    ? 'bg-sky-700 text-white shadow-xs' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto p-4 divide-y divide-gray-100 flex-1">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Không tìm thấy người dùng phù hợp.
            </div>
          ) : (
            filteredUsers.map(user => {
              const isSelected = currentUser?.id === user.id;
              const isMaker = (user.roles || []).some(r => r.includes('MAKER') || r.includes('OFFICER'));
              const isChecker = (user.roles || []).some(r => r.includes('CHECKER') || r.includes('APPROVER') || r.includes('SUPERVISOR'));
              const isAdmin = (user.roles || []).some(r => r.includes('ADMIN') || r.includes('Super'));

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className={`py-3 px-3 rounded flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-sky-50 border border-sky-300 shadow-xs' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                      isAdmin ? 'bg-[#1072ba] text-white' :
                      isChecker ? 'bg-[#1072ba]/15 text-[#1072ba]' :
                      isMaker ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.username[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-800 font-mono">
                          {user.username}
                        </span>
                        {isAdmin && (
                          <span className="text-xs text-[#28a745] font-semibold">
                            ADMIN
                          </span>
                        )}
                        {isChecker && (
                          <span className="text-xs text-[#1072ba] font-semibold">
                            CHECKER (Phê duyệt)
                          </span>
                        )}
                        {isMaker && (
                          <span className="text-xs text-gray-600 font-semibold">
                            MAKER (Khởi tạo)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                        <span>{user.firstname} {user.lastname}</span>
                        <span className="text-gray-300">-</span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {user.officeName}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Vai trò: <span className="text-sky-700 font-medium">{(user.roles || []).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-sky-700 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Đang chọn</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>Tổng số 27 tài khoản nhân sự từ file sao lưu</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded mifos-btn-default font-medium text-xs border"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
