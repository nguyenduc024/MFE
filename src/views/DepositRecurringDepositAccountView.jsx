import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style matching Image 2)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
  prefix = null,
  rightIcon = null,
  textAlign = 'left',
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
        {prefix && (
          <span className="text-xs font-semibold text-gray-700 select-none mr-2">
            {prefix}
          </span>
        )}
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
          className={`w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 disabled:text-gray-400 disabled:cursor-not-allowed ${
            textAlign === 'right' ? 'text-right' : 'text-left'
          }`}
        />
        {rightIcon && (
          <div className="absolute right-0 bottom-1 pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable Floating Label Select Component (Material underline style matching Image 2)
 */
function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
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
        <select
          id={id}
          required={required}
          disabled={disabled}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent text-xs outline-none pr-6 pt-0.5 cursor-pointer appearance-none disabled:cursor-not-allowed ${
            disabled ? 'text-gray-400' : (!isFloated ? 'text-transparent' : 'text-gray-800')
          }`}
        >
          {children}
        </select>
        <ChevronDown className={`w-3.5 h-3.5 absolute right-0 pointer-events-none ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
      </div>
    </div>
  );
}

export default function DepositRecurringDepositAccountView({
  recurringDeposit,
  client,
  onSubmitDeposit,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail
}) {
  const accountNo = recurringDeposit?.accountNo || '000000004';
  const clientName = recurringDeposit?.clientName || client?.displayName || 'Lan Ngoc Pham';

  const [transactionDate, setTransactionDate] = useState('10/13/2026');
  const [transactionAmount, setTransactionAmount] = useState('500,000.00');
  const [paymentType, setPaymentType] = useState('Money Transfer');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [note, setNote] = useState('');

  // Payment detail fields
  const [accountNumber, setAccountNumber] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [routingCode, setRoutingCode] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');

  // Practice event listeners
  useEffect(() => {
    const handleAutofill = () => {
      setTransactionDate('10/13/2026');
      setTransactionAmount('500,000.00');
      setPaymentType('Money Transfer');
      setShowPaymentDetails(false);
      setNote('Goal savings monthly installment #1');
    };

    const handleSubmitEvent = () => {
      handleSubmit();
    };

    window.addEventListener('practice-autofill-rd-deposit', handleAutofill);
    window.addEventListener('practice-submit-rd-deposit', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-rd-deposit', handleAutofill);
      window.removeEventListener('practice-submit-rd-deposit', handleSubmitEvent);
    };
  }, [transactionDate, transactionAmount, paymentType, note]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmitDeposit) {
      onSubmitDeposit({
        transactionDate: transactionDate || '10/13/2026',
        transactionAmount: transactionAmount || '500,000.00',
        paymentType: paymentType || 'Money Transfer',
        note,
        accountNumber,
        chequeNumber,
        routingCode,
        receiptNumber,
        bankNumber
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Breadcrumb matching Image 2 */}
      <div className="flex items-center space-x-2.5 mb-8">
        <h1 className="text-xl font-normal text-[#212529]">
          Deposit
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
          <span 
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            4
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Deposit</span>
        </div>
      </div>

      {/* 2. Main Form Card matching Image 2 */}
      <div className="max-w-2xl mx-auto bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 p-8">
        <form id="tour-rd-deposit-form" onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-6">
            {/* Transaction Date */}
            <div>
              <FloatingInput
                id="tour-rd-deposit-date"
                label="Transaction Date *"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                placeholder="10/13/2026"
                required
                rightIcon={<Calendar className="w-4 h-4 text-gray-500" />}
              />
            </div>

            {/* Transaction Amount */}
            <div>
              <FloatingInput
                id="tour-rd-deposit-amount"
                label="Transaction Amount *"
                prefix="VND"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                textAlign="right"
                required
              />
            </div>

            {/* Payment Type Id */}
            <div>
              <FloatingSelect
                id="tour-rd-deposit-payment-type"
                label="Payment Type Id *"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="Money Transfer">Money Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </FloatingSelect>
            </div>

            {/* Toggle: Show Payment Details matching Image 2 */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showPaymentDetails ? 'bg-[#1072ba]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showPaymentDetails ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-normal text-gray-700 cursor-pointer select-none" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
                Show Payment Details
              </span>
            </div>

            {/* Optional Payment Details fields if expanded */}
            {showPaymentDetails && (
              <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
                <FloatingInput
                  label="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                <FloatingInput
                  label="Cheque Number"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                />
                <FloatingInput
                  label="Routing Code"
                  value={routingCode}
                  onChange={(e) => setRoutingCode(e.target.value)}
                />
                <FloatingInput
                  label="Receipt Number"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                />
                <FloatingInput
                  label="Bank Number"
                  value={bankNumber}
                  onChange={(e) => setBankNumber(e.target.value)}
                />
              </div>
            )}

            {/* Note */}
            <div>
              <FloatingInput
                id="tour-rd-deposit-note"
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
              id="tour-rd-deposit-submit-btn"
              className="px-7 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
            >
              Submit
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
