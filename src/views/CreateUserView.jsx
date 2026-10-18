import React, { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style)
 * When empty & unfocused: label acts as placeholder at baseline.
 * When focused or has value or error: label smoothly floats upwards and shrinks.
 * When error exists: label, underline, and error text below are red.
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
 * Reusable Floating Label Select Component
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
      <ChevronDown className="w-3.5 h-3.5 absolute right-0 bottom-1.5 pointer-events-none text-gray-400" />
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

export default function CreateUserView({
  offices = [],
  roles = [],
  users = [],
  onAddUser,
  onSelectUser,
  navigate
}) {
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    passwordNeverExpires: false,
    sendPasswordToEmail: true,
    password: '',
    repeatPassword: '',
    officeId: offices[0]?.id || '1',
    staffId: '',
    roleId: roles[0]?.id || '1'
  });

  // Track touched state for validation display
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    firstname: false,
    lastname: false,
    password: false,
    repeatPassword: false
  });

  // Guided practice autofill listener
  React.useEffect(() => {
    const handleAutofill = (e) => {
      const selectedRole = roles.find(r => !r.name.toLowerCase().includes('super user')) || roles[0];
      setFormData({
        username: e?.detail?.username || 'tkb.teller01',
        email: e?.detail?.email || 'tkb.teller01@tkb.org',
        firstname: e?.detail?.firstname || 'Huong',
        lastname: e?.detail?.lastname || 'Doan',
        passwordNeverExpires: false,
        sendPasswordToEmail: true,
        password: '',
        repeatPassword: '',
        officeId: offices[0]?.id || '1',
        staffId: '',
        roleId: selectedRole?.id || roles[0]?.id || '1'
      });
      setTouched({
        username: true,
        email: true,
        firstname: true,
        lastname: true
      });
    };
    window.addEventListener('practice-autofill-user', handleAutofill);
    return () => window.removeEventListener('practice-autofill-user', handleAutofill);
  }, [roles, offices]);

  // Staff options based on selected office
  const staffList = useMemo(() => {
    return users
      .filter(u => u.enabled !== false && !u.username.includes('DELETED'))
      .map(u => ({
        id: u.id,
        name: `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.username,
        officeId: u.officeId
      }));
  }, [users]);

  // Form validity check
  const isPasswordValid = formData.sendPasswordToEmail || (
    formData.password.trim().length > 0 &&
    formData.repeatPassword.trim().length > 0 &&
    formData.password === formData.repeatPassword
  );

  const isFormValid = Boolean(
    formData.username.trim() &&
    formData.email.trim() &&
    formData.firstname.trim() &&
    formData.lastname.trim() &&
    formData.officeId &&
    formData.roleId &&
    isPasswordValid
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
      username: true,
      email: true,
      firstname: true,
      lastname: true,
      password: true,
      repeatPassword: true
    });

    if (!isFormValid) return;

    const office = offices.find(o => o.id === formData.officeId);
    const role = roles.find(r => r.id === formData.roleId);

    const maxId = users.reduce((max, u) => Math.max(max, parseInt(u.id, 10) || 0), 27);
    const newUserId = String(maxId + 1);

    const newUser = {
      id: newUserId,
      username: formData.username.trim(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      officeId: formData.officeId,
      officeName: office ? office.name : 'Hoan Kiem Transaction Office',
      roles: role ? [role.name] : ['TKB_ACCOUNTING_CHECKER'],
      enabled: true,
      passwordNeverExpires: formData.passwordNeverExpires,
      sendPasswordToEmail: formData.sendPasswordToEmail
    };

    if (onAddUser) {
      onAddUser(newUser);
    }

    if (onSelectUser) {
      onSelectUser(newUser);
    }

    if (navigate) {
      navigate('admin-user-detail');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Header: "Create User | Home / Users / Create User" */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Create User
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
          <span className="text-gray-500">Create User</span>
        </div>
      </div>

      {/* Main Card */}
      <div id="tour-user-input-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-7">
            {/* Row 1: Username * | Email * */}
            <FloatingInput
              label="Username *"
              required
              value={formData.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              onBlur={() => handleFieldBlur('username')}
              error={touched.username && !formData.username.trim() ? 'Username is required' : ''}
            />

            <FloatingInput
              label="Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              error={touched.email && !formData.email.trim() ? 'Email is required' : ''}
            />

            {/* Row 2: First Name * | Last Name * */}
            <FloatingInput
              label="First Name *"
              required
              value={formData.firstname}
              onChange={(e) => handleFieldChange('firstname', e.target.value)}
              onBlur={() => handleFieldBlur('firstname')}
              error={touched.firstname && !formData.firstname.trim() ? 'First Name is required' : ''}
            />

            <FloatingInput
              label="Last Name *"
              required
              value={formData.lastname}
              onChange={(e) => handleFieldChange('lastname', e.target.value)}
              onBlur={() => handleFieldBlur('lastname')}
              error={touched.lastname && !formData.lastname.trim() ? 'Last Name is required' : ''}
            />

            {/* Row 3: Password never expires [ ] | Send password to email address [ ] */}
            <div className="flex items-center justify-between pt-1 pb-1 text-xs text-gray-700 select-none">
              <label 
                onClick={() => handleFieldChange('passwordNeverExpires', !formData.passwordNeverExpires)}
                className="cursor-pointer"
              >
                Password never expires
              </label>
              <div 
                onClick={() => handleFieldChange('passwordNeverExpires', !formData.passwordNeverExpires)}
                className={`w-4 h-4 rounded-[2px] flex items-center justify-center cursor-pointer transition-colors ${
                  formData.passwordNeverExpires 
                    ? 'border border-[#1072ba] bg-[#1072ba] text-white' 
                    : 'border border-gray-400 bg-white'
                }`}
              >
                {formData.passwordNeverExpires && (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-1 text-xs text-gray-700 select-none">
              <label 
                onClick={() => handleFieldChange('sendPasswordToEmail', !formData.sendPasswordToEmail)}
                className="cursor-pointer"
              >
                Send password to email address
              </label>
              <div 
                onClick={() => handleFieldChange('sendPasswordToEmail', !formData.sendPasswordToEmail)}
                className={`w-4 h-4 rounded-[2px] flex items-center justify-center cursor-pointer transition-colors ${
                  formData.sendPasswordToEmail 
                    ? 'border border-[#28a745] bg-[#28a745] text-white' 
                    : 'border border-gray-400 bg-white'
                }`}
              >
                {formData.sendPasswordToEmail && (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
            </div>

            {/* Row 3.5: Password * | Repeat Password * (Shown ONLY when Send password to email is UNCHECKED) */}
            {!formData.sendPasswordToEmail && (
              <>
                <FloatingInput
                  label="Password *"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  error={touched.password && !formData.password.trim() ? 'Password is required' : ''}
                />

                <FloatingInput
                  label="Repeat Password *"
                  type="password"
                  required
                  value={formData.repeatPassword}
                  onChange={(e) => handleFieldChange('repeatPassword', e.target.value)}
                  onBlur={() => handleFieldBlur('repeatPassword')}
                  error={
                    touched.repeatPassword && !formData.repeatPassword.trim()
                      ? 'Repeat Password is required'
                      : touched.repeatPassword && formData.password !== formData.repeatPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                />
              </>
            )}

            {/* Row 4: Office * | Staff */}
            <FloatingSelect
              label="Office *"
              required
              value={formData.officeId}
              onChange={(e) => handleFieldChange('officeId', e.target.value)}
            >
              {offices.length === 0 ? (
                <option value="1">Takashimaya Bank (TKB) - HO</option>
              ) : (
                offices.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))
              )}
            </FloatingSelect>

            {/* Staff: shows only "Staff" as label without "Select staff" dummy text */}
            <FloatingSelect
              label="Staff"
              value={formData.staffId}
              onChange={(e) => handleFieldChange('staffId', e.target.value)}
            >
              <option value=""></option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </FloatingSelect>

            {/* Row 5: Roles * | (Empty) */}
            <FloatingSelect
              label="Roles *"
              required
              value={formData.roleId}
              onChange={(e) => handleFieldChange('roleId', e.target.value)}
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </FloatingSelect>

            <div>{/* Empty column matching layout */}</div>
          </div>

          {/* Centered Action Buttons (Cancel | Submit) */}
          <div className="flex items-center justify-center space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate && navigate('admin-users')}
              className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-[2px] text-xs font-normal shadow-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              id="tour-submit-user-btn"
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
  );
}
