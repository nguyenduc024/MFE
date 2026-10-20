import React, { useState, useMemo, useEffect } from 'react';
import { SquarePen, Lock, Unlock, Trash2, Check } from 'lucide-react';
import { PERMISSION_CATEGORIES, INITIAL_ROLE_PERMISSIONS } from '../data/mifosPermissions';

export default function RoleDetailView({
  role,
  roles = [],
  rolePermissions = null,
  onSavePermissions,
  onToggleRoleDisabled,
  onDeleteRole,
  navigate,
  initialEditMode = false
}) {
  // Default to Role 4 (TKB_ACCOUNTING_MAKER) if no role is passed
  const currentRole = useMemo(() => {
    if (role) return role;
    const found = roles.find(r => String(r.id) === '4') || roles[0];
    return found || {
      id: '4',
      name: 'TKB_ACCOUNTING_MAKER',
      description: 'Responsible for initiating accounting transactions and journal entries, subject to approval by authorized accounting checkers.',
      disabled: false
    };
  }, [role, roles]);

  const roleId = currentRole.id || '4';

  // Edit Mode state
  // User requirement: "khi ấn nút Edit Role ở trên thì các nội dung tickbox mới đậm màu, lúc đó user có thể edit"
  const [isEditMode, setIsEditMode] = useState(initialEditMode);

  // Active Category state: default to 'special' matching media_1792467234716_07cb4b62.png
  const [activeCategoryId, setActiveCategoryId] = useState('special');

  // Active permissions for this role
  const defaultRolePerms = useMemo(() => {
    if (rolePermissions && Array.isArray(rolePermissions)) {
      return rolePermissions;
    }
    const fromData = INITIAL_ROLE_PERMISSIONS[String(roleId)];
    if (fromData) return fromData;
    // Fallback for role 4
    if (String(roleId) === '4') {
      return [
        'READ_GLACCOUNT',
        'CREATE_JOURNALENTRY',
        'READ_GLCLOSURE',
        'READ_JOURNALENTRY',
        'READ_ACCOUNTINGRULE',
        'READ_FINANCIALACTIVITYACCOUNT',
        'READ_OFFICE'
      ];
    }
    return [];
  }, [rolePermissions, roleId]);

  // Working set of permissions (can be edited when in edit mode)
  const [selectedPermissions, setSelectedPermissions] = useState(() => new Set(defaultRolePerms));
  const [toastMessage, setToastMessage] = useState('');

  // Sync when defaultRolePerms changes
  useEffect(() => {
    setSelectedPermissions(new Set(defaultRolePerms));
  }, [defaultRolePerms]);

  // Listen for autofill event from practice tour
  useEffect(() => {
    const handleAutofill = (e) => {
      const perms = e?.detail?.permissions;
      if (perms && Array.isArray(perms)) {
        setIsEditMode(true);
        setSelectedPermissions(prev => {
          const next = new Set(prev);
          perms.forEach(p => next.add(p));
          return next;
        });
        if (e.detail.activeCategory) {
          setActiveCategoryId(e.detail.activeCategory);
        }
      }
    };
    window.addEventListener('practice-autofill-role-permissions', handleAutofill);
    return () => window.removeEventListener('practice-autofill-role-permissions', handleAutofill);
  }, []);

  // Active category object from PERMISSION_CATEGORIES
  const activeCategory = useMemo(() => {
    return PERMISSION_CATEGORIES.find(c => c.id === activeCategoryId) || PERMISSION_CATEGORIES[0];
  }, [activeCategoryId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Toggle single permission (only in edit mode)
  const handleTogglePermission = (code) => {
    if (!isEditMode) return;
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Select all permissions in current category
  const handleSelectAll = () => {
    if (!isEditMode || !activeCategory) return;
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      activeCategory.permissions.forEach(p => next.add(p.code));
      return next;
    });
  };

  // Deselect all permissions in current category
  const handleDeselectAll = () => {
    if (!isEditMode || !activeCategory) return;
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      activeCategory.permissions.forEach(p => next.delete(p.code));
      return next;
    });
  };

  // Cancel edit mode
  const handleCancel = () => {
    setSelectedPermissions(new Set(defaultRolePerms));
    setIsEditMode(false);
  };

  // Submit & save permissions
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const updatedList = Array.from(selectedPermissions);
    if (onSavePermissions) {
      onSavePermissions(currentRole.id, updatedList);
    }
    showToast('Role permissions saved successfully!');
    setIsEditMode(false);
    window.dispatchEvent(new CustomEvent('practice-role-permissions-submitted', {
      detail: {
        roleId: currentRole.id,
        roleName: currentRole.name,
        permissionsCount: updatedList.length
      }
    }));
  };

  // Toggle Disable / Enable Role
  const handleToggleDisable = () => {
    if (onToggleRoleDisabled) {
      onToggleRoleDisabled(currentRole.id);
    }
    showToast(currentRole.disabled ? 'Role enabled successfully!' : 'Role disabled successfully!');
  };

  // Delete Role
  const handleDeleteRole = () => {
    if (window.confirm(`Are you sure you want to delete role "${currentRole.name}"?`)) {
      if (onDeleteRole) {
        onDeleteRole(currentRole.id);
      }
      if (navigate) {
        navigate('admin-roles');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#28a745] text-white px-4 py-2 rounded shadow-lg text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Breadcrumbs matching media_1792467234716_07cb4b62.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left: Role ID & Breadcrumbs */}
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            {roleId}
          </h1>
          <span className="text-gray-300 font-light text-base">|</span>
          <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5 flex-wrap">
            <span
              onClick={() => navigate && navigate('home')}
              className="text-gray-600 hover:underline cursor-pointer"
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
            <span
              onClick={() => navigate && navigate('admin-roles')}
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Roles and Permissions
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">{roleId}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* Edit Role Button: Clicking this activates edit mode and darkens checkboxes */}
          <button
            id="tour-edit-role-btn"
            type="button"
            onClick={() => setIsEditMode(prev => !prev)}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Edit Role</span>
          </button>

          {/* Disable / Enable Role Button */}
          <button
            type="button"
            onClick={handleToggleDisable}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-[2px] shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {currentRole.disabled ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-gray-700" />
                <span>Enable Role</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-gray-700" />
                <span>Disable Role</span>
              </>
            )}
          </button>

          {/* Delete Role Button */}
          <button
            type="button"
            onClick={handleDeleteRole}
            className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Role</span>
          </button>
        </div>
      </div>

      {/* 2. Top Card: Role Information Card */}
      <div id="tour-role-info-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6 mb-6">
        <div className="space-y-4 text-xs">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-48 font-bold text-gray-800 shrink-0">Name:</span>
            <span className="font-normal text-gray-800">{currentRole.name}</span>
          </div>

          {/* Role Description */}
          <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="w-48 font-bold text-gray-800 shrink-0 pt-0.5">Role Description:</span>
            <span className="font-normal text-gray-700 leading-relaxed max-w-3xl">
              {currentRole.description || ''}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Card: Permissions Matrix (28 Categories) */}
      <div id="tour-permissions-matrix-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6 min-h-[580px]">
        {/* Card Header matching screenshots */}
        <div className="flex items-center justify-between pb-5">
          <h2 className="text-xs font-bold text-gray-900">
            Permissions: {activeCategory?.name || 'Special'}
          </h2>

          {/* In Edit Mode: Show Select All and Deselect All buttons matching media_1792467247888_d4d926a6.png */}
          {isEditMode && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-1.5 rounded-[2px] shadow-2xs transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-1.5 rounded-[2px] shadow-2xs transition-colors cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>

        {/* Matrix Container */}
        <div className="flex flex-col md:flex-row min-h-[520px]">
          {/* Left Column: Category Navigation */}
          <div id="tour-category-tabs-list" className="w-full md:w-56 border-r border-gray-200 shrink-0 py-1 bg-white max-h-[700px] overflow-y-auto">
            {PERMISSION_CATEGORIES.map((category) => {
              const isCategoryActive = category.id === activeCategoryId;
              return (
                <div
                  key={category.id}
                  id={`tour-category-tab-${category.id}`}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    isCategoryActive
                      ? 'bg-[#f0f0f0] font-medium text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 font-normal'
                  }`}
                >
                  {category.name}
                </div>
              );
            })}
          </div>

          {/* Right Column: Permissions for Selected Category */}
          <div id="tour-permissions-list" className="flex-1 pl-6 pt-1 flex flex-col justify-between overflow-x-auto">
            {/* Checkbox List for Current Category */}
            <div className="space-y-3.5">
              {activeCategory?.permissions?.map((perm) => {
                const isChecked = selectedPermissions.has(perm.code);

                return (
                  <div
                    key={perm.code}
                    onClick={() => {
                      if (isEditMode) {
                        handleTogglePermission(perm.code);
                      }
                    }}
                    className={`flex items-center space-x-3 text-xs ${
                      isEditMode ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* Checkbox square */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={!isEditMode}
                      onChange={() => {
                        if (isEditMode) {
                          handleTogglePermission(perm.code);
                        }
                      }}
                      className={`w-3.5 h-3.5 rounded-[2px] accent-[#1072ba] transition-colors ${
                        isEditMode
                          ? 'border-gray-800 text-[#1072ba] cursor-pointer'
                          : 'border-gray-300 cursor-default opacity-60'
                      }`}
                    />

                    {/* Label */}
                    <span
                      className={`text-xs select-none transition-colors ${
                        isEditMode
                          ? 'text-gray-900 font-normal'
                          : 'text-[#9e9e9e] font-normal'
                      }`}
                    >
                      {perm.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Form Actions: Cancel & Submit buttons matching media_1792468098071_dc817b36.png */}
            {isEditMode && (
              <div className="flex items-center justify-center space-x-3 pt-10 pb-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="tour-submit-permissions-btn"
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] transition-colors shadow-2xs cursor-pointer"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
