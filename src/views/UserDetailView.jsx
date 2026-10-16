import React, { useState } from 'react';
import { SquarePen, Trash2, Settings, X, Check } from 'lucide-react';

export default function UserDetailView({
  user,
  onDeleteUser,
  navigate
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [restrictedModalOpen, setRestrictedModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Fallback user if none selected (matching screenshot defaults)
  const displayUser = user || {
    id: '28',
    username: 'user_password',
    firstname: 'Dat',
    lastname: 'Nguyen',
    email: 'nguyenduc.personal@gmail.com',
    officeName: 'Hoan Kiem Transaction Office',
    roles: ['TKB_ACCOUNTING_CHECKER']
  };

  const isSystemUser = displayUser?.id === '1' || displayUser?.id === '2' || displayUser?.username === 'mifos' || displayUser?.username === 'system';

  const rolesText = Array.isArray(displayUser.roles) 
    ? displayUser.roles.join(', ') 
    : displayUser.roles || 'TKB_ACCOUNTING_CHECKER';

  const handleDeleteConfirm = () => {
    if (onDeleteUser) {
      onDeleteUser(displayUser.id);
    }
    setShowDeleteModal(false);
    if (navigate) {
      navigate('admin-users');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== repeatPassword) return;
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setNewPassword('');
      setRepeatPassword('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Toast Notification */}
      {passwordSuccess && (
        <div className="fixed top-16 right-6 z-50 bg-[#28a745] text-white px-4 py-2 rounded shadow-lg text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {/* Header: "28 | Home / Users / 28" matching screenshot */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          {displayUser.id}
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={() => navigate && navigate('home')} 
            className="hover:text-[#1072ba] cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={() => navigate && navigate('admin-users')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Users
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{displayUser.id}</span>
        </div>
      </div>

      {/* Main Content: Card with buttons aligned to its right */}
      <div className="max-w-xl mx-auto">
        {/* Action Buttons Row directly above the Card */}
        <div className="flex items-center justify-end space-x-2 mb-3">
          <button
            onClick={() => {
              if (isSystemUser) {
                setRestrictedModalOpen(true);
                return;
              }
              if (navigate) navigate('admin-create-user');
            }}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white px-3 py-1.5 rounded-[2px] text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Edit User"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              if (isSystemUser) {
                setRestrictedModalOpen(true);
                return;
              }
              setShowDeleteModal(true);
            }}
            className="bg-[#e53935] hover:bg-[#c62828] text-white px-3 py-1.5 rounded-[2px] text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => {
              if (isSystemUser) {
                setRestrictedModalOpen(true);
                return;
              }
              setShowPasswordModal(true);
            }}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white px-3 py-1.5 rounded-[2px] text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Change Password"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] px-8 py-8">
          <div className="space-y-6 text-xs">
            {/* 1. Login Name */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                Login Name
              </span>
              <span className="text-gray-900 font-normal">
                {displayUser.username}
              </span>
            </div>

            {/* 2. First Name */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                First Name
              </span>
              <span className="text-gray-900 font-normal">
                {displayUser.firstname}
              </span>
            </div>

            {/* 3. Last Name */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                Last Name
              </span>
              <span className="text-gray-900 font-normal">
                {displayUser.lastname}
              </span>
            </div>

            {/* 4. Email */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                Email
              </span>
              <span className="text-gray-900 font-normal">
                {displayUser.email}
              </span>
            </div>

            {/* 5. Office */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                Office
              </span>
              <span className="text-gray-900 font-normal">
                {displayUser.officeName || 'Hoan Kiem Transaction Office'}
              </span>
            </div>

            {/* 6. Roles */}
            <div className="flex items-baseline">
              <span className="w-40 text-gray-700 font-medium select-none">
                Roles
              </span>
              <span className="text-gray-900 font-normal">
                {rolesText}
              </span>
            </div>
          </div>

          {/* Centered Back Button matching screenshot */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => navigate && navigate('admin-users')}
              className="bg-[#1072ba] hover:bg-[#0e619e] text-white px-5 py-1.5 rounded-[2px] text-xs font-normal shadow-xs transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-semibold text-gray-800">Confirm Delete</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete user <span className="font-semibold">{displayUser.username}</span>?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 rounded text-xs bg-[#e53935] hover:bg-[#c62828] text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
              <h3 className="font-normal text-sm">Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-white hover:opacity-80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-[2px] outline-none focus:border-[#1072ba]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Repeat Password *</label>
                <input
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-[2px] outline-none focus:border-[#1072ba]"
                />
                {repeatPassword && newPassword !== repeatPassword && (
                  <span className="text-[10px] text-red-500 mt-1 block">Passwords do not match</span>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPassword || newPassword !== repeatPassword}
                  className="px-4 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] disabled:bg-gray-300 text-white rounded-[2px]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restricted System User Modal */}
      {restrictedModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-sm w-full p-6 text-gray-800 space-y-3.5 animate-in zoom-in-95">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#e53935]">
              Thao tác không được phép
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              Tài khoản hệ thống mặc định được bảo vệ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tài khoản <strong className="text-gray-900 font-semibold">{displayUser.username || displayUser.firstname}</strong> ({displayUser.firstname} {displayUser.lastname}) là tài khoản hệ thống mặc định của core banking. Bạn không được phép chỉnh sửa, đổi mật khẩu hoặc xóa tài khoản này trong phạm vi bài học.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRestrictedModalOpen(false)}
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
