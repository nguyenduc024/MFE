import React, { useState } from 'react';

/**
 * Reusable Floating Label Input Component (Material underline style)
 */
function FloatingInput({
  label,
  value,
  onChange,
  onBlur,
  error = '',
  type = 'text',
  required = false,
  disabled = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(error);

  let borderColor = 'border-gray-300';
  let labelColor = 'text-gray-500';

  if (error) {
    borderColor = 'border-[#e53935]';
    labelColor = 'text-[#e53935] font-medium';
  } else if (isFocused) {
    borderColor = 'border-[#1072ba]';
    labelColor = 'text-[#1072ba] font-medium';
  }

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${borderColor} ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? `-top-0.5 text-[10px] ${labelColor}`
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
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-2 pt-0.5"
      />
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Textarea Component with resize handle
 */
function FloatingTextarea({
  label,
  value,
  onChange,
  onBlur,
  error = '',
  required = false,
  disabled = false,
  rows = 2,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(error);

  let borderColor = 'border-gray-300';
  let labelColor = 'text-gray-500';

  if (error) {
    borderColor = 'border-[#e53935]';
    labelColor = 'text-[#e53935] font-medium';
  } else if (isFocused) {
    borderColor = 'border-[#1072ba]';
    labelColor = 'text-[#1072ba] font-medium';
  }

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${borderColor} ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? `-top-0.5 text-[10px] ${labelColor}`
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <textarea
        rows={rows}
        required={required}
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-2 pt-0.5 resize-y"
      />
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

export default function AddRoleView({ onAddRole, navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false
  });

  // Guided practice autofill listener
  React.useEffect(() => {
    const handleAutofill = (e) => {
      setFormData({
        name: e?.detail?.name || 'TKB_TELLER_CASHIER',
        description: e?.detail?.description || 'Giao dịch viên thực hiện các giao dịch tiền mặt, thu chi và dịch vụ khách hàng tại quầy.'
      });
      setTouched({ name: true, description: true });
    };
    window.addEventListener('practice-autofill-role', handleAutofill);
    return () => window.removeEventListener('practice-autofill-role', handleAutofill);
  }, []);

  const isFormValid = Boolean(
    formData.name.trim() && 
    formData.description.trim()
  );

  const handleFieldChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      description: true
    });

    if (!isFormValid) return;

    const newRole = {
      id: String(Date.now()),
      name: formData.name.trim(),
      description: formData.description.trim(),
      disabled: false
    };

    if (onAddRole) {
      onAddRole(newRole);
    }

    if (navigate) {
      navigate('admin-roles');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Header: "Add | Home / System / Roles and Permissions / Add" matching screenshot */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Add
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
          <span 
            onClick={() => navigate && navigate('admin-roles')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Roles and Permissions
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Add</span>
        </div>
      </div>

      {/* Main Centered Card */}
      <div className="max-w-xl mx-auto">
        <div id="tour-role-input-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] px-10 py-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Field 1: Name * */}
            <FloatingInput
              label="Name *"
              required
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              error={touched.name && !formData.name.trim() ? 'Role Name is required' : ''}
            />

            {/* Field 2: Description * */}
            <FloatingTextarea
              label="Description *"
              required
              rows={2}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => handleFieldBlur('description')}
              error={touched.description && !formData.description.trim() ? 'Role Description is required' : ''}
            />

            {/* Centered Buttons: Cancel | Submit */}
            <div className="flex items-center justify-center space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate && navigate('admin-roles')}
                className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-[2px] text-xs font-normal shadow-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="tour-submit-role-btn"
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-1.5 rounded-[2px] text-xs font-normal transition-colors ${
                  isFormValid
                    ? 'bg-[#1072ba] hover:bg-[#0e619e] text-white shadow-xs cursor-pointer'
                    : 'bg-[#e0e0e0] text-[#9e9e9e] cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
