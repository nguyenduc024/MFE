import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * Reusable Floating Label Input (Material Underline Style)
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
  rightIcon = null,
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
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-7 pt-0.5"
      />
      {rightIcon && (
        <div className="absolute right-0 bottom-1.5 text-gray-400 pointer-events-none">
          {rightIcon}
        </div>
      )}
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
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
  onBlur,
  children,
  error = '',
  required = false,
  disabled = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(error);

  let borderColor = 'border-gray-300';
  let labelColor = 'text-gray-500';
  let chevronColor = 'text-gray-400';

  if (error) {
    borderColor = 'border-[#e53935]';
    labelColor = 'text-[#e53935] font-medium';
    chevronColor = 'text-[#e53935]';
  } else if (isFocused) {
    borderColor = 'border-[#1072ba]';
    labelColor = 'text-[#1072ba] font-medium';
    chevronColor = 'text-[#1072ba]';
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
      <select
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className={`w-3.5 h-3.5 absolute right-0 bottom-1.5 pointer-events-none ${chevronColor}`} />
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

export default function CreateOfficeView({
  offices = [],
  onAddOffice,
  navigate
}) {
  // Form State matching screenshot fields:
  // Office * | Parent Office * | Opened On * | External ID
  const [formData, setFormData] = useState({
    name: '',
    parentId: '', // starts empty to authentically reflect Parent Office validation
    openingDate: '2026-08-01',
    externalId: ''
  });

  // Track touched state for validation display
  const [touched, setTouched] = useState({
    name: false,
    parentId: true, // touched by default to replicate screenshot state
    openingDate: false,
    externalId: false
  });

  // Guided practice autofill listener
  React.useEffect(() => {
    const handleAutofill = (e) => {
      if (e?.detail) {
        setFormData({
          name: e.detail.name || '',
          parentId: e.detail.parentId || 'none',
          openingDate: e.detail.openingDate || '2026-08-01',
          externalId: e.detail.externalId || ''
        });
        setTouched({
          name: true,
          parentId: true,
          openingDate: true,
          externalId: true
        });
      }
    };
    window.addEventListener('practice-autofill-office', handleAutofill);
    return () => window.removeEventListener('practice-autofill-office', handleAutofill);
  }, []);

  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.parentId &&
    formData.openingDate
  );

  const handleFieldChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Quick autofill for 4-tier banking organization practice
  const handleQuickFill = (tier) => {
    // Tìm các cấp parent có sẵn trong hệ thống
    const headOffice = offices.find(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
    const regionalOffice = offices.find(o => {
      if (!o.parentId) return false;
      const p = offices.find(x => x.id === o.parentId);
      return (p && !p.parentId) || o.name.toLowerCase().includes('region') || o.name.toLowerCase().includes('khu vực');
    });
    const branchOffice = offices.find(o => o.name.toLowerCase().includes('branch') || o.name.toLowerCase().includes('chi nhánh'));

    if (tier === 'ho') {
      setFormData({
        name: 'Takashimaya Bank (TKB) - HO',
        parentId: 'none',
        openingDate: '2026-08-01',
        externalId: 'TKB - HO - 001'
      });
    } else if (tier === 'ro') {
      setFormData({
        name: 'TKB - Northern Region Office',
        parentId: headOffice ? headOffice.id : (offices[0]?.id || 'none'),
        openingDate: '2026-08-02',
        externalId: 'TKB - RO - NORTH'
      });
    } else if (tier === 'br') {
      setFormData({
        name: 'Hanoi Branch',
        parentId: regionalOffice ? regionalOffice.id : (headOffice ? headOffice.id : (offices[0]?.id || 'none')),
        openingDate: '2026-08-03',
        externalId: 'TKB - BR - HAN'
      });
    } else if (tier === 'to') {
      setFormData({
        name: 'Cau Giay Transaction Office',
        parentId: branchOffice ? branchOffice.id : (regionalOffice ? regionalOffice.id : (offices[0]?.id || 'none')),
        openingDate: '2026-08-04',
        externalId: 'TKB-TO-HAN-02'
      });
    }

    setTouched({
      name: true,
      parentId: true,
      openingDate: true,
      externalId: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      parentId: true,
      openingDate: true,
      externalId: true
    });

    if (!isFormValid) return;

    const isRoot = formData.parentId === 'none' || formData.parentId === 'root';
    const parent = isRoot ? null : offices.find(o => String(o.id) === String(formData.parentId));
    const newOffice = {
      id: String(Date.now()),
      name: formData.name.trim(),
      externalId: formData.externalId.trim(),
      parentId: isRoot ? null : formData.parentId,
      parentName: parent ? parent.name : null,
      openingDate: formData.openingDate,
      hierarchy: parent ? `${parent.hierarchy || '.'}${Date.now()}.` : '.'
    };

    if (onAddOffice) {
      onAddOffice(newOffice);
    }

    if (navigate) {
      navigate('admin-offices');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* Header: "Create Office | Home / Organization / Manage Offices / Create Office" */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Create Office
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={() => navigate && navigate('home')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={() => navigate && navigate('admin-organization')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Organization
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={() => navigate && navigate('admin-offices')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Manage Offices
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create Office</span>
        </div>
      </div>

      {/* Main Centered Card */}
      <div id="tour-office-input-card" className="max-w-xl mx-auto bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8">
        
        {/* Quick Sample Fill Buttons for 4-Tier Learning */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Điền nhanh mẫu thực hành Phần 2:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('ho')}
              className="px-2 py-1.5 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] transition-colors cursor-pointer text-center truncate"
              title="Điền mẫu tạo Hội sở chính (Root HO)"
            >
              1. Hội sở (HO)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ro')}
              className="px-2 py-1.5 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] transition-colors cursor-pointer text-center truncate"
              title="Điền mẫu tạo Văn phòng khu vực (Miền Bắc) có parent là Hội sở"
            >
              2. Khu vực (Bắc)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('br')}
              className="px-2 py-1.5 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] transition-colors cursor-pointer text-center truncate"
              title="Điền mẫu tạo Chi nhánh Hà Nội có parent là Văn phòng khu vực"
            >
              3. Chi nhánh
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('to')}
              className="px-2 py-1.5 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] transition-colors cursor-pointer text-center truncate"
              title="Điền mẫu tạo Phòng giao dịch Cầu Giấy có parent là Chi nhánh"
            >
              4. PGD (TO)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Office * */}
          <FloatingInput
            label="Office *"
            required
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleFieldBlur('name')}
            error={touched.name && !formData.name.trim() ? 'Office is required' : ''}
          />

          {/* 2. Parent Office * (Shows exact red error state from screenshot when empty) */}
          <FloatingSelect
            label="Parent Office *"
            required
            value={formData.parentId}
            onChange={(e) => handleFieldChange('parentId', e.target.value)}
            onBlur={() => handleFieldBlur('parentId')}
            error={touched.parentId && !formData.parentId ? 'Parent Office is required' : ''}
          >
            <option value="">Select Parent Office</option>
            {/* Cho phép chọn Root đối với Hội sở chính */}
            <option value="none">(None / Root - Hội sở chính)</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </FloatingSelect>

          {/* 3. Opened On * with Calendar Icon */}
          <FloatingInput
            label="Opened On *"
            type="date"
            required
            value={formData.openingDate}
            onChange={(e) => handleFieldChange('openingDate', e.target.value)}
            onBlur={() => handleFieldBlur('openingDate')}
            error={touched.openingDate && !formData.openingDate ? 'Opened On is required' : ''}
            rightIcon={<Calendar className="w-4 h-4 text-gray-500" />}
          />

          {/* 4. External ID */}
          <FloatingInput
            label="External ID"
            value={formData.externalId}
            onChange={(e) => handleFieldChange('externalId', e.target.value)}
          />

          {/* Centered Action Buttons (Matching Screenshot) */}
          <div className="pt-6 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => navigate && navigate('admin-offices')}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-1.5 rounded-[2px] text-xs font-medium cursor-pointer shadow-xs transition-colors"
            >
              Cancel
            </button>
            <button
              id="tour-submit-office-btn"
              type="submit"
              disabled={!isFormValid}
              className={`px-5 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                isFormValid
                  ? 'bg-[#1072ba] hover:bg-[#0e619e] text-white shadow-xs cursor-pointer'
                  : 'bg-[#d5d5d5] text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
