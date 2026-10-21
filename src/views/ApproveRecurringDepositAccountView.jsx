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

export default function ApproveRecurringDepositAccountView({
  recurringDeposit,
  client,
  onApprove,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail
}) {
  const accountNo = recurringDeposit?.accountNo || '000000004';
  const clientName = recurringDeposit?.clientName || client?.displayName || 'Lan Ngoc Pham';

  const [approvedOn, setApprovedOn] = useState('10/13/2026');
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

    window.addEventListener('practice-autofill-rda-approve', handleAutofill);
    window.addEventListener('practice-confirm-rda-approve', handleConfirmEvent);

    return () => {
      window.removeEventListener('practice-autofill-rda-approve', handleAutofill);
      window.removeEventListener('practice-confirm-rda-approve', handleConfirmEvent);
    };
  }, [approvedOn, note, onApprove]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onApprove) {
      onApprove({ approvedOn: approvedOn || '10/13/2026', note });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Breadcrumb matching Image 2 */}
      <div className="flex items-center space-x-2.5 mb-8">
        <h1 className="text-xl font-normal text-[#212529]">
          Approve
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
            Recurring Deposits
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-[#1072ba] hover:underline cursor-pointer">
            4
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Approve</span>
        </div>
      </div>

      {/* 2. Main Form Card matching Image 2 */}
      <div className="max-w-2xl mx-auto bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 p-8">
        <form id="tour-rd-approve-form" onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            {/* Approved On Date */}
            <div>
              <FloatingInput
                id="tour-rd-approved-on-input"
                label="Approved On Date *"
                value={approvedOn}
                onChange={(e) => setApprovedOn(e.target.value)}
                placeholder="10/13/2026"
                required
                rightIcon={<Calendar className="w-4 h-4 text-gray-500" />}
              />
            </div>

            {/* Note */}
            <div>
              <FloatingInput
                id="tour-rd-note-input"
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons matching Image 2 */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-[3px] cursor-pointer select-none transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="tour-rd-approve-submit-btn"
              className="px-7 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
            >
              Confirm
            </button>
          </div>

        </form>
      </div>

      {/* 3. Footer matching Image 2 */}
      <div className="mt-16 text-center text-xs text-gray-500 space-y-1">
        <div className="flex items-center justify-center space-x-12">
          <span>Mifos</span>
          <span>250331-</span>
        </div>
        <div className="flex items-center justify-center space-x-6">
          <span>Fineract</span>
          <span>1.16.0 - SNAPSHOT</span>
        </div>
        <div className="text-[11px] text-gray-400 pt-1">
          http://192.168.56.101:8080
        </div>
      </div>

    </div>
  );
}
