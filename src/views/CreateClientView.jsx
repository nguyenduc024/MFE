import React, { useState } from 'react';
import { 
  Pencil, Calendar, ChevronDown, Plus, Trash2, Check, X
} from 'lucide-react';

/**
 * Helper to format date strings into Mifos format: DD MMMM YYYY (e.g. "02 March 2004", "20 October 2026")
 */
function formatDisplayDate(dateVal, fallback = '—') {
  if (!dateVal) return fallback;

  // Handle MM/DD/YYYY format like "10/20/2026"
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateVal)) {
    const [month, day, year] = dateVal.split('/');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // Handle YYYY-MM-DD format like "2004-03-02"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
    const [year, month, day] = dateVal.split('-');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // If already contains month name or is valid date
  const parsed = new Date(dateVal);
  if (!isNaN(parsed.getTime())) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${String(parsed.getDate()).padStart(2, '0')} ${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return dateVal;
}

/**
 * Reusable Floating Label Input Component (Material underline style matching screenshot)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  rightIcon = null,
  disabled = false,
  hasError = false,
  errorMessage = '',
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      hasError 
        ? 'border-[#dc3545]' 
        : isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-1 text-[11px] ' + (hasError ? 'text-[#dc3545]' : isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs ' + (hasError ? 'text-[#dc3545]' : 'text-gray-500')
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
        <div className={`absolute right-0 bottom-1.5 pointer-events-none ${hasError ? 'text-[#dc3545]' : 'text-gray-400'}`}>
          {rightIcon}
        </div>
      )}
      {hasError && errorMessage && (
        <div className="text-[11px] text-[#dc3545] font-normal mt-1 absolute -bottom-5 left-0 select-none">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Select Component (Material underline style matching screenshot)
 */
function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  hasError = false,
  errorMessage = '',
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      hasError 
        ? 'border-[#dc3545]' 
        : isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-1 text-[11px] ' + (hasError ? 'text-[#dc3545]' : isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs ' + (hasError ? 'text-[#dc3545]' : 'text-gray-500')
        }`}
      >
        {label}
      </label>
      <select
        required={required}
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <div className={`absolute right-0 bottom-1.5 pointer-events-none ${hasError ? 'text-[#dc3545]' : 'text-gray-500'}`}>
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      {hasError && errorMessage && (
        <div className="text-[11px] text-[#dc3545] font-normal mt-1 absolute -bottom-5 left-0 select-none">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function CreateClientView({
  offices = [],
  users = [],
  onSaveClient,
  onCancel,
  onNavigateHome,
  onNavigateClients
}) {
  const [step, setStep] = useState(1); // 1: GENERAL, 2: FAMILY MEMBERS, 3: PREVIEW
  const [hasVisitedPreview, setHasVisitedPreview] = useState(false);

  // Form State
  // Initial state has officeId: '' so it displays the red error "Office is required" exactly as in screenshot Image 1
  const [formData, setFormData] = useState({
    officeId: '',
    legalForm: 'Person',
    externalId: '',
    firstname: '',
    middlename: '',
    lastname: '',
    dateOfBirth: '',
    gender: '',
    staffId: '',
    isStaff: false,
    mobileNo: '',
    emailAddress: '',
    clientType: '',
    clientClassification: '',
    submittedOn: '10/20/2026',
    active: false,
    openSavingsAccount: false
  });

  // Track if user touched office field or validated
  const [officeTouched, setOfficeTouched] = useState(true); // true initially to replicate Image 1
  const officeHasError = officeTouched && !formData.officeId;

  // Family Members State for Step 2
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    firstname: '',
    lastname: '',
    relationship: 'Spouse',
    dateOfBirth: '',
    gender: 'Female'
  });

  // Quick autofill with the user's sample data from Image 1 & Image 3
  const handleQuickAutofillSample = () => {
    // Find Quangninh Branch or fallback office
    const qnOffice = offices.find(o => o.name && o.name.toLowerCase().includes('quangninh')) || offices[0];

    setFormData({
      officeId: qnOffice ? String(qnOffice.id) : '18',
      legalForm: 'Person',
      externalId: 'TKB-CUS-2004',
      firstname: 'NG Anh',
      middlename: '',
      lastname: 'Minhh',
      dateOfBirth: '2004-03-02',
      gender: 'Male',
      staffId: users[0]?.id || '',
      isStaff: false,
      mobileNo: '0912345678',
      emailAddress: 'ng.anhminhh@takashimayabank.org',
      clientType: 'Individual',
      clientClassification: 'Retail',
      submittedOn: '10/20/2026',
      active: false,
      openSavingsAccount: false
    });
    setOfficeTouched(true);
  };

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!newFamilyMember.firstname.trim() || !newFamilyMember.lastname.trim()) return;
    setFamilyMembers([
      ...familyMembers, 
      { ...newFamilyMember, id: Date.now() }
    ]);
    setNewFamilyMember({ firstname: '', lastname: '', relationship: 'Spouse', dateOfBirth: '', gender: 'Female' });
    setShowAddFamilyModal(false);
  };

  const handleRemoveFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  // Step 1 Validation -> Next
  const handleNextFromStep1 = (e) => {
    if (e) e.preventDefault();
    setOfficeTouched(true);

    if (!formData.officeId) {
      // Keep user on step 1 with red error matching Image 1
      return;
    }
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      alert('Please fill in required fields: First Name and Last Name.');
      return;
    }

    setStep(2);
  };

  // Step 2 Next -> Preview (Step 3)
  const handleNextFromStep2 = () => {
    setHasVisitedPreview(true);
    setStep(3);
  };

  // Step 3 Submit -> Finalize
  const handleSubmitFinal = () => {
    const office = offices.find(o => String(o.id) === String(formData.officeId));
    const fullName = `${formData.firstname} ${formData.middlename ? formData.middlename + ' ' : ''}${formData.lastname}`.trim();

    const newClient = {
      id: String(Date.now()),
      accountNo: '', // assigned in App.jsx
      externalId: formData.externalId || `TKB-CUS-${String(Math.floor(100 + Math.random() * 900))}`,
      displayName: fullName || 'NG Anh Minhh',
      firstname: formData.firstname || 'NG Anh',
      lastname: formData.lastname || 'Minhh',
      middlename: formData.middlename || '',
      officeId: formData.officeId || '18',
      officeName: office ? office.name : 'Quangninh Branch',
      legalForm: formData.legalForm,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      staffId: formData.staffId,
      isStaff: formData.isStaff,
      mobileNo: formData.mobileNo || null,
      email: formData.emailAddress || null,
      clientType: formData.clientType,
      clientClassification: formData.clientClassification,
      status: formData.active ? 'Active' : 'Pending',
      activationDate: formData.active ? new Date().toISOString().split('T')[0] : null,
      familyMembers: familyMembers,
      openSavingsAccount: formData.openSavingsAccount
    };

    if (onSaveClient) {
      onSaveClient(newClient);
    }
  };

  // Resolve office name for preview
  const selectedOffice = offices.find(o => String(o.id) === String(formData.officeId));
  const previewOfficeName = selectedOffice 
    ? selectedOffice.name 
    : (formData.officeId === '18' ? 'Quangninh Branch' : (formData.officeId ? `Office #${formData.officeId}` : 'Quangninh Branch'));

  // Resolve client full name for preview
  const previewFullName = `${formData.firstname} ${formData.middlename ? formData.middlename + ' ' : ''}${formData.lastname}`.trim() || 'NG Anh Minhh';

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching screenshot: Create Client | Home / Clients / Create Client */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Create Client
          </h1>
          <span className="text-gray-300 font-light text-base">|</span>
          <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
            <span 
              onClick={onNavigateHome} 
              className="text-gray-600 hover:underline cursor-pointer"
            >
              Home
            </span>
            <span className="text-gray-400">/</span>
            <span 
              onClick={onNavigateClients} 
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Clients
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Create Client</span>
          </div>
        </div>

        {/* Quick autofill sample helper */}
        <button
          type="button"
          onClick={handleQuickAutofillSample}
          className="text-xs text-[#1072ba] hover:bg-sky-50 px-2.5 py-1 rounded border border-sky-200 font-medium transition-colors cursor-pointer"
          title="Điền nhanh dữ liệu mẫu theo screenshot: NG Anh Minhh - Quangninh Branch"
        >
          Điền nhanh mẫu (NG Anh Minhh)
        </button>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header (Authentic Mifos X Material Stepper) */}
        {/* Case A: On Step 1 initially -> 2 steps visible (GENERAL on left, FAMILY MEMBERS on right) matching Image 1 */}
        {step === 1 && !hasVisitedPreview ? (
          <div className="relative flex items-center justify-between px-8 pt-1 pb-4">
            {/* Connecting line */}
            <div className="absolute left-14 right-14 top-4.5 h-[1px] bg-gray-300 -z-0" />

            {/* Step 1: GENERAL (Active: Blue circle with Pencil) */}
            <div className="flex flex-col items-center z-10 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                <Pencil className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold tracking-wider mt-1.5 uppercase text-gray-800">
                GENERAL
              </span>
            </div>

            {/* Step 2: FAMILY MEMBERS (Pending: Gray circle with Pencil) */}
            <div 
              onClick={() => {
                if (formData.officeId && formData.firstname && formData.lastname) {
                  setStep(2);
                }
              }} 
              className="flex flex-col items-center z-10 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#808080] text-white flex items-center justify-center shadow-2xs">
                <Pencil className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold tracking-wider mt-1.5 uppercase text-gray-700">
                FAMILY MEMBERS
              </span>
            </div>
          </div>
        ) : (
          /* Case B: On Step 2 or 3 (or after visiting preview) -> 3 steps visible matching Image 2 & Image 3 */
          <div className="relative flex items-center justify-between px-8 pt-1 pb-4">
            {/* Connecting line spanning 3 circles */}
            <div className="absolute left-14 right-14 top-4.5 h-[1px] bg-gray-300 -z-0" />

            {/* Step 1: GENERAL */}
            <div 
              onClick={() => setStep(1)} 
              className="flex flex-col items-center z-10 cursor-pointer"
            >
              {step === 1 ? (
                <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
                step === 1 ? 'text-gray-900 font-bold' : 'text-gray-700'
              }`}>
                GENERAL
              </span>
            </div>

            {/* Step 2: FAMILY MEMBERS */}
            <div 
              onClick={() => setStep(2)} 
              className="flex flex-col items-center z-10 cursor-pointer"
            >
              {step === 2 ? (
                <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              ) : step > 2 ? (
                <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#808080] text-white flex items-center justify-center shadow-2xs">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              )}
              <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
                step === 2 ? 'text-gray-900 font-bold' : 'text-gray-700'
              }`}>
                FAMILY MEMBERS
              </span>
            </div>

            {/* Step 3: PREVIEW */}
            <div 
              onClick={() => {
                if (hasVisitedPreview || (formData.officeId && formData.firstname && formData.lastname)) {
                  setStep(3);
                }
              }} 
              className="flex flex-col items-center z-10 cursor-pointer"
            >
              {step === 3 ? (
                <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              ) : (
                /* Matches Image 2: Green checkmark on PREVIEW */
                <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
                step === 3 ? 'text-gray-900 font-bold' : 'text-gray-700'
              }`}>
                PREVIEW
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: GENERAL FORM (Exact match to Image 1)                 */}
        {/* ------------------------------------------------------------- */}
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="space-y-7 pt-2">
            
            {/* Row 1: Office * (Col 1), Legal Form * (Col 2), External Id (Col 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Office * with error state matching Image 1 */}
              <FloatingSelect
                label="Office *"
                required
                value={formData.officeId}
                hasError={officeHasError}
                errorMessage="Office is required"
                onChange={(e) => {
                  setFormData({ ...formData, officeId: e.target.value });
                  setOfficeTouched(true);
                }}
              >
                <option value=""></option>
                {offices.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </FloatingSelect>

              {/* Legal Form * (Defaults to Person) */}
              <FloatingSelect
                label="Legal Form *"
                required
                value={formData.legalForm}
                onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
              >
                <option value="Person">Person</option>
                <option value="Entity">Entity</option>
              </FloatingSelect>

              {/* External Id */}
              <FloatingInput
                label="External Id"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
            </div>

            {/* Row 2: First Name * (Col 1), Middle Name (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="First Name *"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />

              <FloatingInput
                label="Middle Name"
                value={formData.middlename}
                onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
              />
            </div>

            {/* Row 3: Last Name * (Col 1), Empty (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Last Name *"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
              <div />
            </div>

            {/* Row 4: Date of Birth (Col 1), Gender (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Date of Birth"
                type="text"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                rightIcon={<Calendar className="w-3.5 h-3.5" />}
              />

              <FloatingSelect
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FloatingSelect>
            </div>

            {/* Row 5: Staff (Col 1), Is staff? Checkbox (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <FloatingSelect
                label="Staff"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              >
                <option value=""></option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.firstname} {u.lastname} ({u.username})
                  </option>
                ))}
              </FloatingSelect>

              {/* Is staff? with checkbox to the right: "Is staff? [ ]" */}
              <div className="flex items-center space-x-2 pb-1.5">
                <span className="text-xs text-gray-700">Is staff?</span>
                <input
                  type="checkbox"
                  checked={formData.isStaff}
                  onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Row 6: Mobile No (Col 1), Email Address (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Mobile No"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
              />

              <FloatingInput
                label="Email Address"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              />
            </div>

            {/* Row 7: Client Type (Col 1), Client Classification (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingSelect
                label="Client Type"
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
              >
                <option value=""></option>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
              </FloatingSelect>

              <FloatingSelect
                label="Client Classification"
                value={formData.clientClassification}
                onChange={(e) => setFormData({ ...formData, clientClassification: e.target.value })}
              >
                <option value=""></option>
                <option value="Retail">Retail</option>
                <option value="VIP">VIP</option>
                <option value="SME">SME</option>
              </FloatingSelect>
            </div>

            {/* Row 8: Submitted On * (Col 1), Active? (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <FloatingInput
                label="Submitted On *"
                required
                value={formData.submittedOn}
                onChange={(e) => setFormData({ ...formData, submittedOn: e.target.value })}
                rightIcon={<Calendar className="w-3.5 h-3.5" />}
              />

              {/* Active? with checkbox to the right: "Active? [ ]" */}
              <div className="flex items-center space-x-2 pb-1.5">
                <span className="text-xs text-gray-700">Active?</span>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Row 9: Open Savings Account? Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-xs text-gray-700">Open Savings Account?</span>
              <input
                type="checkbox"
                checked={formData.openSavingsAccount}
                onChange={(e) => setFormData({ ...formData, openSavingsAccount: e.target.checked })}
                className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Centered Action Buttons matching Image 1: [ <- Previous ] (disabled) [ Next -> ] */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                disabled
                className="bg-[#eaedf1] text-[#9e9e9e] text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 cursor-not-allowed shadow-2xs select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="submit"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>

          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: FAMILY MEMBERS (Exact match to Image 2)               */}
        {/* ------------------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-6 pt-2">
            
            {/* Header: Family Members on left, [+ Add] button on right matching Image 2 */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#212529]">
                Family Members
              </h3>

              <button
                type="button"
                onClick={() => setShowAddFamilyModal(true)}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-1.5 rounded-[3px] flex items-center space-x-1 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Modal / Form to Add Family Member */}
            {showAddFamilyModal && (
              <div className="bg-gray-50 p-5 rounded-[2px] border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-xs font-bold text-gray-800">Add Family Member</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowAddFamilyModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FloatingInput
                    label="First Name *"
                    required
                    value={newFamilyMember.firstname}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, firstname: e.target.value })}
                  />

                  <FloatingInput
                    label="Last Name *"
                    required
                    value={newFamilyMember.lastname}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, lastname: e.target.value })}
                  />

                  <FloatingSelect
                    label="Relationship *"
                    value={newFamilyMember.relationship}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </FloatingSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <FloatingInput
                    label="Date of Birth"
                    value={newFamilyMember.dateOfBirth}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, dateOfBirth: e.target.value })}
                    rightIcon={<Calendar className="w-3.5 h-3.5" />}
                  />

                  <FloatingSelect
                    label="Gender"
                    value={newFamilyMember.gender}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </FloatingSelect>
                </div>

                <div className="flex items-center justify-end space-x-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFamilyModal(false)}
                    className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-[3px] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="px-5 py-1.5 text-xs font-medium text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px]"
                  >
                    Save Member
                  </button>
                </div>
              </div>
            )}

            {/* Family Members Table or Empty space */}
            {familyMembers.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                    <tr>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Relationship</th>
                      <th className="py-2 px-3">Date of Birth</th>
                      <th className="py-2 px-3">Gender</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {familyMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-800">{m.firstname} {m.lastname}</td>
                        <td className="py-2 px-3 text-gray-600">{m.relationship}</td>
                        <td className="py-2 px-3 text-gray-600">{formatDisplayDate(m.dateOfBirth)}</td>
                        <td className="py-2 px-3 text-gray-600">{m.gender}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveFamilyMember(m.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Matches Image 2: Clean empty space when no family members added */
              <div className="py-12" />
            )}

            {/* Action Buttons for Step 2 matching Image 2: [ <- Previous ] [ Next -> ] */}
            <div className="flex items-center justify-center space-x-3 pt-6 pb-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: PREVIEW (Exact match to Image 3)                      */}
        {/* ------------------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-6 pt-2">
            
            {/* Section Title: General with thin horizontal line underneath matching Image 3 */}
            <div>
              <h3 className="text-sm font-medium text-[#212529] pb-2">
                General
              </h3>
              <div className="w-full h-[1px] bg-gray-200" />
            </div>

            {/* Two-column summary key-value list matching Image 3 */}
            <div className="space-y-3.5 text-xs text-[#212529] max-w-3xl">
              
              {/* Row 1: Name */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Name</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{previewFullName}</span>
              </div>

              {/* Row 2: Office */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Office</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{previewOfficeName}</span>
              </div>

              {/* Row 3: Legal Form */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Legal Form</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.legalForm || 'Person'}</span>
              </div>

              {/* Row 4: Date of Birth (Formatted e.g. "02 March 2004") */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Date of Birth</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">
                  {formatDisplayDate(formData.dateOfBirth, '02 March 2004')}
                </span>
              </div>

              {/* Row 5: Submitted On Date (Formatted e.g. "20 October 2026") */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Submitted On Date</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">
                  {formatDisplayDate(formData.submittedOn, '20 October 2026')}
                </span>
              </div>

              {/* Row 6: Active? */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Active?</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.active ? 'Yes' : 'No'}</span>
              </div>

              {/* Row 7: Is staff? */}
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-4 md:col-span-3 text-gray-700">Is staff?</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.isStaff ? 'Yes' : 'No'}</span>
              </div>

              {/* Optional Fields from input */}
              {formData.externalId && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">External Id</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.externalId}</span>
                </div>
              )}

              {formData.gender && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Gender</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.gender}</span>
                </div>
              )}

              {formData.mobileNo && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Mobile No</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.mobileNo}</span>
                </div>
              )}

              {formData.emailAddress && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Email Address</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.emailAddress}</span>
                </div>
              )}

              {formData.clientType && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Client Type</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.clientType}</span>
                </div>
              )}

              {formData.clientClassification && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Client Classification</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.clientClassification}</span>
                </div>
              )}

              {formData.openSavingsAccount && (
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-4 md:col-span-3 text-gray-700">Open Savings Account?</span>
                  <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">Yes</span>
                </div>
              )}

            </div>

            {/* Family Members summary if any */}
            {familyMembers.length > 0 && (
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Family Members ({familyMembers.length})</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                      <tr>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Relationship</th>
                        <th className="py-2 px-3">Date of Birth</th>
                        <th className="py-2 px-3">Gender</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {familyMembers.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 px-3 font-medium text-gray-800">{m.firstname} {m.lastname}</td>
                          <td className="py-2 px-3 text-gray-600">{m.relationship}</td>
                          <td className="py-2 px-3 text-gray-600">{formatDisplayDate(m.dateOfBirth)}</td>
                          <td className="py-2 px-3 text-gray-600">{m.gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons for Step 3 matching Image 3: [ <- Previous ] [ Cancel ] [ Submit ] */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitFinal}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-normal px-6 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Submit
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
