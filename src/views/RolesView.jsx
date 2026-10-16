import React, { useState, useMemo } from 'react';
import { 
  Plus, X, ChevronDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, SquarePen, Check
} from 'lucide-react';

/**
 * Reusable Floating Label Input for Filter & Modal
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

export default function RolesView({ 
  roles = [], 
  onAddRole, 
  navigate 
}) {
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [restrictedModalRole, setRestrictedModalRole] = useState(null);

  // System roles that cannot be edited or modified
  const isSystemRole = (role) => {
    if (!role) return false;
    const name = (role.name || '').toLowerCase();
    return name === 'super user' || name === 'self service user' || role.id === '1' || role.id === '2';
  };

  // Form State for Add / Edit Role
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    disabled: false
  });

  // Filter Roles
  const filteredRoles = useMemo(() => {
    const text = filterText.toLowerCase().trim();
    if (!text) return roles;
    return roles.filter(r => 
      r.name.toLowerCase().includes(text) ||
      (r.description || '').toLowerCase().includes(text)
    );
  }, [roles, filterText]);

  // Pagination calculations
  const totalItems = filteredRoles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      disabled: false
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (role) => {
    if (isSystemRole(role)) {
      setRestrictedModalRole(role);
      return;
    }
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      disabled: Boolean(role.disabled)
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingRole) {
      // Edit existing role
      editingRole.name = formData.name.trim();
      editingRole.description = formData.description.trim();
      editingRole.disabled = formData.disabled;
      showToast('Role updated successfully!');
    } else {
      // Add new role
      const newRole = {
        id: String(Date.now()),
        name: formData.name.trim(),
        description: formData.description.trim(),
        disabled: formData.disabled
      };
      if (onAddRole) {
        onAddRole(newRole);
      }
      showToast('Role added successfully!');
    }

    setShowAddModal(false);
    setEditingRole(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#28a745] text-white px-4 py-2 rounded shadow-lg text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: "Roles and Permissions | Home / System / Roles and Permissions" on left, "+ Add Role" on right */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Roles and Permissions
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
              onClick={() => navigate && navigate('admin-system')} 
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              System
            </span>
            <span className="text-gray-400">/</span>
            <span>Roles and Permissions</span>
          </div>
        </div>

        <button
          id="tour-add-role-btn"
          onClick={() => navigate ? navigate('admin-add-role') : handleOpenAddModal()}
          className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Filter with animated floating label underline */}
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

      {/* Roles Table Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-white">
                <th className="py-3 px-4 text-xs font-semibold text-gray-700 w-1/4">Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700 w-1/2">Description</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700 text-center w-24">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-700 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400 text-xs">
                    {filterText ? 'No roles found matching filter.' : 'No roles found.'}
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role, idx) => {
                  const isOdd = idx % 2 === 1;
                  const isSuperUser = role.name.toLowerCase().includes('super user');

                  return (
                    <tr 
                      key={role.id || idx}
                      onClick={() => {
                        if (isSystemRole(role)) {
                          setRestrictedModalRole(role);
                        }
                      }}
                      className={`transition-colors ${
                        isSystemRole(role) ? 'cursor-pointer' : ''
                      } ${
                        isOdd ? 'bg-[#f5f6f8]' : 'bg-white'
                      } hover:bg-[#eef5fa]`}
                    >
                      {/* 1. Name */}
                      <td className="py-3 px-4 text-xs text-[#212529] font-normal align-middle">
                        {role.name}
                      </td>

                      {/* 2. Description */}
                      <td className="py-3 px-4 text-xs text-gray-600 font-normal align-middle leading-relaxed">
                        {role.description || ''}
                      </td>

                      {/* 3. Status (Clean circular dot, no border, no padding) */}
                      <td className="py-3 px-4 text-center align-middle">
                        <span 
                          className={`w-2.5 h-2.5 rounded-full inline-block ${
                            role.disabled ? 'bg-[#e53935]' : 'bg-[#28a745]'
                          }`}
                          title={role.disabled ? 'Disabled' : 'Enabled'}
                        />
                      </td>

                      {/* 4. Actions (Super user has no edit icon) */}
                      <td className="py-3 px-4 text-center align-middle">
                        {!isSuperUser ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(role);
                            }}
                            className="text-[#1072ba] hover:text-[#0e619e] cursor-pointer inline-flex items-center justify-center p-1 rounded hover:bg-sky-50 transition-colors"
                            title={`Edit ${role.name}`}
                          >
                            <SquarePen className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer: Pagination Controls matching screenshot */}
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

      {/* Add / Edit Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2px] shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
              <h3 className="font-normal text-sm">
                {editingRole ? 'Edit Role' : 'Add Role'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white hover:opacity-80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-xs">
              <FloatingInput
                label="Role Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <FloatingInput
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="flex items-center justify-between pt-2 text-xs text-gray-700 select-none">
                <label 
                  onClick={() => setFormData({ ...formData, disabled: !formData.disabled })}
                  className="cursor-pointer"
                >
                  Disabled (Vô hiệu hóa vai trò)
                </label>
                <input
                  type="checkbox"
                  checked={formData.disabled}
                  onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                  className="w-4 h-4 rounded-xs border-gray-300 accent-[#e53935] cursor-pointer"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-[2px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="bg-[#1072ba] hover:bg-[#0e619e] disabled:bg-gray-300 text-white px-4 py-1.5 rounded-[2px] font-medium shadow-xs cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restricted System Role Modal */}
      {restrictedModalRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-sm w-full p-6 text-gray-800 space-y-3.5 animate-in zoom-in-95">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#e53935]">
              Thao tác không được phép
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              Vai trò hệ thống mặc định được bảo vệ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vai trò <strong className="text-gray-900 font-semibold">{restrictedModalRole.name}</strong> là vai trò mặc định của hệ thống core banking. Bạn không được phép chỉnh sửa hoặc thay đổi cấu hình vai trò này trong phạm vi bài học.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRestrictedModalRole(null)}
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
