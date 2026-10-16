import React, { useState } from 'react';
import { 
  Pencil, Calendar, ChevronDown, Plus, Trash2
} from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style)
 * When empty & unfocused: label acts as placeholder at the input baseline.
 * When focused or has value: label smoothly floats upwards and shrinks.
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  rightIcon = null,
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
        <div className="absolute right-0 bottom-1.5 pointer-events-none text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Select Component
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
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 bottom-1.5 pointer-events-none" />
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
  const [step, setStep] = useState(1); // 1: GENERAL, 2: FAMILY MEMBERS

  // Format today's date as MM/DD/YYYY for display (matching screenshot "10/16/2026")
  const today = new Date();
  const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  // Form State
  const [formData, setFormData] = useState({
    officeId: offices[0]?.id || '1',
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
    submittedOn: formattedToday,
    active: false,
    openSavingsAccount: false
  });

  // Family Members State for Step 2
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    firstname: '',
    lastname: '',
    relationship: 'Spouse',
    dateOfBirth: ''
  });
  const [showAddFamily, setShowAddFamily] = useState(false);

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!newFamilyMember.firstname.trim() || !newFamilyMember.lastname.trim()) return;
    setFamilyMembers([...familyMembers, { ...newFamilyMember, id: Date.now() }]);
    setNewFamilyMember({ firstname: '', lastname: '', relationship: 'Spouse', dateOfBirth: '' });
    setShowAddFamily(false);
  };

  const handleRemoveFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // If on Step 1 and form is valid, advance to Step 2
    if (step === 1) {
      if (!formData.firstname.trim() || !formData.lastname.trim()) {
        alert('Please fill in required fields: First Name and Last Name.');
        return;
      }
      setStep(2);
      return;
    }

    // If on Step 2, finalize creation
    finalizeCreation();
  };

  const finalizeCreation = () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      alert('Please fill in required fields: First Name and Last Name.');
      setStep(1);
      return;
    }

    const office = offices.find(o => String(o.id) === String(formData.officeId));
    const displayName = `${formData.firstname} ${formData.middlename ? formData.middlename + ' ' : ''}${formData.lastname}`.trim();

    const newClient = {
      id: String(Date.now()),
      accountNo: '', // will be assigned in App.jsx
      externalId: formData.externalId || `TKB-CUS-${String(Math.floor(100 + Math.random() * 900))}`,
      displayName,
      firstname: formData.firstname,
      lastname: formData.lastname,
      middlename: formData.middlename,
      officeId: formData.officeId,
      officeName: office ? office.name : 'Takashimaya Bank (TKB) - HO',
      status: formData.active ? 'Active' : 'Pending',
      activationDate: formData.active ? new Date().toISOString().split('T')[0] : null,
      mobileNo: formData.mobileNo || null,
      email: formData.emailAddress || null,
      familyMembers: familyMembers
    };

    onSaveClient(newClient);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Title & Breadcrumbs (Matches: Create Client | Home / Clients / Create Client) */}
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-xl font-normal text-gray-800">
          Create Client
        </h1>
        <div className="text-xs text-gray-500 flex items-center space-x-1.5">
          <span 
            onClick={onNavigateHome} 
            className="text-[#1072ba] hover:underline cursor-pointer"
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
          <span className="text-gray-700">Create Client</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xs shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header (Matches: Blue Circle GENERAL -------- Gray Circle FAMILY MEMBERS) */}
        <div className="relative flex items-center justify-between px-8 pt-1 pb-4">
          {/* Horizontal connecting line */}
          <div className="absolute left-14 right-14 top-4 h-[1px] bg-gray-300 -z-0" />

          {/* Step 1: GENERAL */}
          <div 
            onClick={() => setStep(1)} 
            className="flex flex-col items-center z-10 cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors ${
              step === 1 ? 'bg-[#1072ba]' : 'bg-[#1072ba]'
            }`}>
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
              step === 1 ? 'text-gray-800 font-bold' : 'text-gray-500'
            }`}>
              GENERAL
            </span>
          </div>

          {/* Step 2: FAMILY MEMBERS */}
          <div 
            onClick={() => {
              if (formData.firstname.trim() && formData.lastname.trim()) {
                setStep(2);
              }
            }} 
            className="flex flex-col items-center z-10 cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors ${
              step === 2 ? 'bg-[#1072ba]' : 'bg-gray-400'
            }`}>
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
              step === 2 ? 'text-gray-800 font-bold' : 'text-gray-500'
            }`}>
              FAMILY MEMBERS
            </span>
          </div>
        </div>

        {/* STEP 1: GENERAL FORM */}
        {step === 1 && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Row 1: Office * (Col 1), Legal Form * (Col 2), External Id (Col 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingSelect
                label="Office *"
                required
                value={formData.officeId}
                onChange={(e) => setFormData({ ...formData, officeId: e.target.value })}
              >
                {offices.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </FloatingSelect>

              <FloatingSelect
                label="Legal Form *"
                required
                value={formData.legalForm}
                onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
              >
                <option value="Person">Person</option>
                <option value="Entity">Entity</option>
              </FloatingSelect>

              <FloatingInput
                label="External Id"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
            </div>

            {/* Row 2: First Name * (Col 1), Middle Name (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label="Last Name *"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
              <div />
            </div>

            {/* Row 4: Date of Birth (Col 1), Gender (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label="Date of Birth"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <FloatingSelect
                label="Staff"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              >
                <option value=""></option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstname} {u.lastname} ({u.username})</option>
                ))}
              </FloatingSelect>

              <div className="flex items-center space-x-2 pb-2">
                <span className="text-xs text-gray-700">Is staff?</span>
                <input
                  type="checkbox"
                  checked={formData.isStaff}
                  onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked })}
                  className="rounded border-gray-300 text-[#1072ba] focus:ring-0"
                />
              </div>
            </div>

            {/* Row 6: Mobile No (Col 1), Email Address (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <FloatingInput
                label="Submitted On *"
                required
                value={formData.submittedOn}
                onChange={(e) => setFormData({ ...formData, submittedOn: e.target.value })}
                rightIcon={<Calendar className="w-3.5 h-3.5" />}
              />

              <div className="flex items-center space-x-2 pb-2">
                <span className="text-xs text-gray-700">Active?</span>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 text-[#1072ba] focus:ring-0"
                />
              </div>
            </div>

            {/* Row 9: Open Savings Account? */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-xs text-gray-700">Open Savings Account?</span>
              <input
                type="checkbox"
                checked={formData.openSavingsAccount}
                onChange={(e) => setFormData({ ...formData, openSavingsAccount: e.target.checked })}
                className="rounded border-gray-300 text-[#1072ba] focus:ring-0"
              />
            </div>

            {/* Centered Buttons: Previous (Disabled) and Next -> */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-transparent">
              <button
                type="button"
                disabled
                className="bg-[#eaedf1] text-[#9e9e9e] text-xs font-medium px-5 py-2 rounded flex items-center gap-1.5 cursor-not-allowed"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="submit"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Next &rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: FAMILY MEMBERS FORM */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Family Members</h3>
                <p className="text-xs text-gray-500">Add any family relationships or dependents (optional).</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddFamily(true)}
                className="bg-[#1072ba] hover:bg-[#0d5f9c] text-white text-xs font-medium px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Family Member</span>
              </button>
            </div>

            {/* Add Family Member Form (Toggleable) */}
            {showAddFamily && (
              <form onSubmit={handleAddFamilyMember} className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    label="Relationship"
                    value={newFamilyMember.relationship}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                  </FloatingSelect>
                  <FloatingInput
                    label="Date of Birth"
                    value={newFamilyMember.dateOfBirth}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFamily(false)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 text-xs bg-[#1072ba] text-white rounded font-medium"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            )}

            {/* Family Members List */}
            {familyMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                No family members added. You can proceed to submit.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Relationship</th>
                    <th className="py-2 px-3">Date of Birth</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {familyMembers.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-800">{m.firstname} {m.lastname}</td>
                      <td className="py-2 px-3 text-gray-600">{m.relationship}</td>
                      <td className="py-2 px-3 text-gray-600">{m.dateOfBirth || '—'}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveFamilyMember(m.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Action Buttons for Step 2 */}
            <div className="flex items-center justify-center space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                onClick={finalizeCreation}
                className="bg-[#1072ba] hover:bg-[#0d5f9c] text-white text-xs font-medium px-6 py-2 rounded flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
