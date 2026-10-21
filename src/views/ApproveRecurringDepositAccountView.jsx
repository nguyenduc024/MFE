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
  const productName = recurringDeposit?.productName || 'TKB Goal Savings';
  const clientName = recurringDeposit?.clientName || client?.displayName || 'Lan Ngoc Pham';

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
    <div className="max-w-4xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Breadcrumb */}
      <div className="flex items-center space-x-2.5 mb-4">
        <h1 className="text-xl font-normal text-[#212529]">
          Approve Recurring Deposit Application
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
            Recurring Deposits ({accountNo})
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Approve</span>
        </div>
      </div>

      {/* 2. Main Form Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-sm font-semibold text-[#1072ba] tracking-wide">
              Approve Recurring Deposit Application
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Account No: <span className="font-semibold text-gray-700">{accountNo}</span> | Product: <span className="font-semibold text-gray-700">{productName}</span> | Client: <span className="font-semibold text-gray-700">{clientName}</span>
            </p>
          </div>

          <div id="tour-rd-approve-form" className="space-y-6 max-w-lg">
            {/* Approved On Date */}
            <div>
              <FloatingInput
                id="tour-rd-approved-on-input"
                label="Approved On *"
                value={approvedOn}
                onChange={(e) => setApprovedOn(e.target.value)}
                placeholder="10/13/2026"
                required
                rightIcon={<Calendar className="w-4 h-4 text-gray-400" />}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Format: MM/DD/YYYY (e.g. 10/13/2026)</span>
            </div>

            {/* Note */}
            <div>
              <FloatingInput
                id="tour-rd-note-input"
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Approval note (optional)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="tour-rd-approve-submit-btn"
              className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
            >
              Submit
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
