import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style matching screenshot Image 3)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  rightIcon = null,
  leftPrefix = null,
  textAlign = 'left',
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
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      
      <div className="flex items-center">
        {leftPrefix && (
          <span className="text-xs text-gray-600 font-medium pr-2 select-none">
            {leftPrefix}
          </span>
        )}
        <input
          type={type}
          required={required}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 text-${textAlign}`}
        />
      </div>

      {rightIcon && (
        <div className="absolute right-0 bottom-1.5 pointer-events-none text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Select Component (Material underline style matching screenshot Image 3)
 */
function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
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
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <select
        required={required}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <div className="absolute right-0 bottom-1.5 pointer-events-none text-gray-500">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

export default function DepositSavingsAccountView({
  savings,
  onCancel,
  onSubmitDeposit,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail
}) {
  const clientName = savings?.clientName || 'Minh Quang Tran';
  const accountNo = savings?.accountNo || '000000001';

  // Form State matching screenshot Image 3
  const [formData, setFormData] = useState({
    transactionDate: '10/13/2026',
    transactionAmount: '',
    paymentType: 'Money Transfer',
    showPaymentDetails: false,
    notes: '',
    accountNumber: '',
    chequeNumber: '',
    routingCode: '',
    receiptNumber: '',
    bankNumber: ''
  });

  const handleQuickAutofillSample = () => {
    setFormData({
      transactionDate: '10/13/2026',
      transactionAmount: '5,000,000.00',
      paymentType: 'Money Transfer',
      showPaymentDetails: false,
      notes: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.',
      accountNumber: '',
      chequeNumber: '',
      routingCode: '',
      receiptNumber: '',
      bankNumber: ''
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanAmount = parseFloat(String(formData.transactionAmount).replace(/,/g, '')) || 5000000;
    if (onSubmitDeposit) {
      onSubmitDeposit({
        savingsId: savings?.id || '1',
        amount: cleanAmount,
        transactionDate: formData.transactionDate,
        paymentType: formData.paymentType,
        notes: formData.notes
      });
    }
  };

  // Listen to practice events
  useEffect(() => {
    const handleAutofillEvent = () => {
      handleQuickAutofillSample();
    };

    const handleSubmitEvent = () => {
      handleSubmit();
    };

    window.addEventListener('practice-autofill-deposit', handleAutofillEvent);
    window.addEventListener('practice-submit-deposit', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-deposit', handleAutofillEvent);
      window.removeEventListener('practice-submit-deposit', handleSubmitEvent);
    };
  }, [formData, savings]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumb matching Image 3: Deposit | Home / Clients / Minh Quang Tran / Savings / Deposit */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2.5">
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
              Savings
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Deposit</span>
          </div>
        </div>

        {/* Quick autofill sample helper */}
        <button
          type="button"
          onClick={handleQuickAutofillSample}
          className="text-xs text-[#1072ba] hover:bg-sky-50 px-2.5 py-1 rounded border border-sky-200 font-medium transition-colors cursor-pointer"
          title="Điền nhanh dữ liệu mẫu nộp tiền 5.000.000 VND theo screenshot"
        >
          Điền nhanh mẫu (5.000.000 VND)
        </button>
      </div>

      {/* 2. Main Card matching Image 3 */}
      <div className="max-w-xl mx-auto bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-6">
        
        {/* Card Title matching Image 3 */}
        <h2 className="text-base font-semibold text-[#212529] tracking-normal">
          Deposit Money To Saving Account
        </h2>

        {/* Form Body */}
        <form id="tour-deposit-savings-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Field 1: Transaction Date * */}
          <FloatingInput
            label="Transaction Date *"
            required
            value={formData.transactionDate}
            onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
            rightIcon={<Calendar className="w-3.5 h-3.5" />}
          />

          {/* Field 2: Transaction Amount * with VND prefix and right-aligned amount */}
          <FloatingInput
            label="Transaction Amount *"
            required
            leftPrefix="VND"
            textAlign="right"
            value={formData.transactionAmount}
            onChange={(e) => setFormData({ ...formData, transactionAmount: e.target.value })}
          />

          {/* Field 3: Payment Type * */}
          <FloatingSelect
            label="Payment Type *"
            required
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
          >
            <option value="Money Transfer">Money Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </FloatingSelect>

          {/* Field 4: Show Payment Details Toggle Switch matching Image 3 */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={formData.showPaymentDetails}
              onClick={() => setFormData({ ...formData, showPaymentDetails: !formData.showPaymentDetails })}
              className={`w-9 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                formData.showPaymentDetails ? 'bg-[#1072ba]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                  formData.showPaymentDetails ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs text-gray-700 select-none">
              Show Payment Details
            </span>
          </div>

          {/* Optional Payment Details expanded when toggled */}
          {formData.showPaymentDetails && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
              <FloatingInput
                label="Account #"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
              <FloatingInput
                label="Cheque #"
                value={formData.chequeNumber}
                onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
              />
              <FloatingInput
                label="Routing Code"
                value={formData.routingCode}
                onChange={(e) => setFormData({ ...formData, routingCode: e.target.value })}
              />
              <FloatingInput
                label="Receipt #"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
              />
              <FloatingInput
                label="Bank #"
                value={formData.bankNumber}
                onChange={(e) => setFormData({ ...formData, bankNumber: e.target.value })}
              />
            </div>
          )}

          {/* Field 5: Notes matching Image 3 */}
          <div className="pt-1">
            <FloatingInput
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Action Buttons: [ Cancel ] [ Submit ] matching Image 3 */}
          <div className="flex items-center justify-center space-x-3 pt-6 pb-1">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-normal px-5 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="tour-deposit-submit-btn"
              className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-normal px-6 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Submit
            </button>
          </div>

        </form>

      </div>

      {/* 3. Authentic Mifos System Footer matching screenshot */}
      <div className="pt-20 pb-6 text-center text-[11px] text-gray-400 space-y-1 select-none font-sans">
        <div className="flex items-center justify-center space-x-6">
          <span>Mifos 250331-</span>
          <span>Fineract 1.16.0-SNAPSHOT</span>
        </div>
        <div>http://192.168.56.101:8080</div>
        <div className="text-gray-500 font-medium">Mifos X by Mifos</div>
      </div>

    </div>
  );
}
