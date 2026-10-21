import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
  rightIcon = null,
  className = '',
  id = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors duration-200 ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 pointer-events-none origin-[0] select-none transition-all duration-200 ease-out z-10 ${
          isFloated
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : (disabled ? 'text-gray-400' : 'text-gray-500'))
            : 'top-3.5 text-xs ' + (disabled ? 'text-gray-400' : 'text-gray-500')
        }`}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={isFocused && !hasValue ? placeholder : ''}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 disabled:text-gray-400 disabled:cursor-not-allowed"
        />
        {rightIcon && (
          <div className="absolute right-0 bottom-1 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApproveFixedDepositAccountView({
  fixedDeposit,
  client,
  onApprove,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail
}) {
  const accountNo = fixedDeposit?.accountNo || '000000003';
  const productName = fixedDeposit?.productName || 'TKB Fixed Deposit';
  const clientName = fixedDeposit?.clientName || client?.displayName || 'Minh Quang Tran';

  const [approvedOn, setApprovedOn] = useState('');
  const [note, setNote] = useState('');

  // Practice event listeners
  useEffect(() => {
    const handleAutofill = () => {
      setApprovedOn('10/13/2026');
      setNote('');
    };

    const handleConfirmEvent = () => {
      if (onApprove) {
        onApprove({ approvedOn: approvedOn || '10/13/2026', note });
      }
    };

    window.addEventListener('practice-autofill-fda-approve', handleAutofill);
    window.addEventListener('practice-confirm-fda-approve', handleConfirmEvent);

    return () => {
      window.removeEventListener('practice-autofill-fda-approve', handleAutofill);
      window.removeEventListener('practice-confirm-fda-approve', handleConfirmEvent);
    };
  }, [approvedOn, note, onApprove]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onApprove) {
      onApprove({ approvedOn: approvedOn || '10/13/2026', note });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumb matching Image 2 */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          {productName} ({accountNo})
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5 flex-wrap">
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
          <span 
            onClick={onNavigateClientDetail} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientName}
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Fixed Deposits
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {productName} ({accountNo})
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">
            {productName} ({accountNo})
          </span>
        </div>
      </div>

      {/* 2. Main Center Card matching Image 2 */}
      <div 
        id="tour-fd-approve-form" 
        className="max-w-2xl mx-auto bg-white p-8 rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <FloatingInput
              id="tour-fd-approve-date-input"
              label="Approved On Date *"
              required
              value={approvedOn}
              onChange={(e) => setApprovedOn(e.target.value)}
              rightIcon={<Calendar className="w-3.5 h-3.5" />}
            />

            <FloatingInput
              id="tour-fd-approve-note-input"
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-normal px-5 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="tour-fd-approve-confirm-btn"
              className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-6 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
