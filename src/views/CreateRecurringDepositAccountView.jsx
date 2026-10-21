import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, CheckCircle2, Pencil, Check, ArrowRight, ArrowLeft } from 'lucide-react';

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
  prefix = null,
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
        {prefix && isFloated && (
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
            prefix && isFloated ? 'text-right' : ''
          }`}
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

/**
 * Reusable Floating Label Select Component (Material underline style)
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
        <ChevronDown className={`w-3.5 h-3.5 absolute right-0 pointer-events-none ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}

export default function CreateRecurringDepositAccountView({
  client,
  recurringDepositProducts = [],
  users = [],
  onSave,
  onSaveRecurringDepositAccount,
  onCancel,
  onNavigateHome,
  onNavigateClients
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1 to 6

  const steps = [
    { id: 1, label: 'DETAILS' },
    { id: 2, label: 'TERMS' },
    { id: 3, label: 'SETTINGS' },
    { id: 4, label: 'INTEREST RATE CHART' },
    { id: 5, label: 'CHARGES' },
    { id: 6, label: 'PREVIEW' }
  ];

  const clientName = client?.displayName || 'Lan Ngoc Pham';
  const defaultProduct = recurringDepositProducts.find(p => p.shortName === 'TKGS' || p.name?.toLowerCase().includes('goal savings')) || recurringDepositProducts[0];

  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 2)
    productName: '',
    productId: '',
    submittedOn: '',
    fieldOfficer: '',
    externalId: '',

    // Step 2: TERMS
    currency: 'VND',
    decimalPlaces: '0',
    currencyMultiplesOf: '1',
    nominalInterestRate: '4.00',
    interestCompoundingPeriod: 'Monthly',
    interestPostingPeriod: 'Monthly',
    interestCalculationUsing: 'Daily Balance',
    daysInYear: '365 Days',

    // Step 3: SETTINGS (Image 3)
    isMandatoryDeposit: false,
    adjustAdvancePayments: false,
    allowWithdrawals: false,
    lockinPeriodFrequency: '',
    lockinPeriodType: '',
    recurringDepositAmount: '',
    depositPeriod: '',
    depositPeriodType: 'Months',
    depositFrequencySameAsGroup: false,
    depositStartDate: '',
    depositFrequency: '',
    depositFrequencyType: 'Months',
    minDepositTermFrequency: '',
    minDepositTermType: 'Months',
    inMultiplesOfFrequency: '',
    inMultiplesOfType: '',
    maxDepositTermFrequency: '',
    maxDepositTermType: 'Months',
    applyPenalInterest: false,
    penalInterest: '',
    penalInterestPeriod: '',
    minBalanceForInterest: '',

    // Step 4: CHART
    chartName: 'TKB Goal Savings Interest 2026',
    chartFromDate: '10/13/2026',
    chartInterestRate: '4.00',

    // Step 5: CHARGES
    chargeId: ''
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const depositAmt = Number(formData.recurringDepositAmount) || 500000;
    const periodMonths = Number(formData.depositPeriod) || 12;
    const totalPrincipal = depositAmt * periodMonths;

    const newAccount = {
      id: 4,
      accountNo: '000000004',
      accountType: 'Recurring Deposit',
      clientId: client?.id || '000000012',
      clientName: clientName,
      productName: formData.productName || 'TKB Goal Savings',
      externalId: formData.externalId || 'TKB-RD-TDU-002',
      status: 'Submitted and pending approval',
      submittedDate: '13 October 2026',
      openedDate: '13 October 2026',
      dateOfDeposit: '13 October 2026',
      maturityDate: '13 October 2027',
      period: `${periodMonths} Months`,
      depositPeriod: `${periodMonths} Months`,
      recurringDepositAmount: depositAmt,
      principal: totalPrincipal,
      maturityAmount: 6131646,
      interestRate: 4.0,
      rateOfInterest: '4.00 %',
      balance: 0,
      totalDeposits: 0,
      actualAvailableBalance: 0,
      totalWithdrawals: 0,
      depositsFrequency: `${formData.depositFrequency || 1} Months`,
      interestCompoundingPeriod: 'Monthly',
      interestPostingPeriod: 'Monthly',
      interestCalculatedUsing: 'Daily Balance',
      daysInYear: '365 Days',
      fieldOfficer: formData.fieldOfficer || 'Unassigned'
    };

    const saveHandler = onSaveRecurringDepositAccount || onSave;
    if (saveHandler) {
      saveHandler(newAccount);
    }
  };

  const handleSubmitRef = useRef();
  handleSubmitRef.current = handleSubmit;

  // Autofill handlers for practice tour
  useEffect(() => {
    const handleAutofillDetails = () => {
      setFormData(prev => ({
        ...prev,
        productName: 'TKB Goal Savings',
        productId: defaultProduct?.id || '1',
        submittedOn: '10/13/2026',
        fieldOfficer: 'Unassigned',
        externalId: 'TKB-RD-TDU-002'
      }));
    };

    const handleAutofillSettings = () => {
      setFormData(prev => ({
        ...prev,
        isMandatoryDeposit: true,
        recurringDepositAmount: '500000',
        depositPeriod: '12',
        depositPeriodType: 'Months',
        depositStartDate: '10/13/2026',
        depositFrequency: '1',
        depositFrequencyType: 'Months',
        minDepositTermFrequency: '12',
        minDepositTermType: 'Months',
        maxDepositTermFrequency: '12',
        maxDepositTermType: 'Months'
      }));
    };

    const handleNextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    };

    const handleSubmitEvent = () => {
      if (handleSubmitRef.current) {
        handleSubmitRef.current();
      }
    };

    window.addEventListener('practice-autofill-rda-details', handleAutofillDetails);
    window.addEventListener('practice-autofill-rda-settings', handleAutofillSettings);
    window.addEventListener('practice-next-rda-step', handleNextStep);
    window.addEventListener('practice-submit-rda', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-rda-details', handleAutofillDetails);
      window.removeEventListener('practice-autofill-rda-settings', handleAutofillSettings);
      window.removeEventListener('practice-next-rda-step', handleNextStep);
      window.removeEventListener('practice-submit-rda', handleSubmitEvent);
    };
  }, [defaultProduct]);

  // Handle product select change
  const handleProductChange = (e) => {
    const prodName = e.target.value;
    setFormData(prev => ({
      ...prev,
      productName: prodName,
      productId: prodName ? (defaultProduct?.id || '1') : ''
    }));
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumbs matching Image 2 & 3 */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Create Recurring Deposits Account
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
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientName}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Recurring Deposits</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Create Recurring Deposits Account</span>
        </div>
      </div>

      {/* 2. Main White Stepper Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 p-6 space-y-6">
        
        {/* Progress Stepper matching Image 2 & Image 3 */}
        <div id="tour-rda-stepper" className="relative flex items-center justify-between px-4 pt-1 pb-4">
          <div className="absolute left-8 right-8 top-4 -translate-y-1/2 h-[1px] bg-gray-200 z-0" />
          
          {steps.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <div 
                key={s.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => setCurrentStep(s.id)}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                    isCompleted 
                      ? 'bg-[#28a745] text-white' 
                      : isCurrent 
                      ? 'bg-[#1072ba] text-white ring-4 ring-blue-50' 
                      : 'bg-white border border-gray-300 text-gray-400 group-hover:border-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <span 
                  className={`text-[11px] mt-2 font-medium tracking-tight text-center whitespace-nowrap ${
                    isCurrent 
                      ? 'text-[#1072ba] font-bold' 
                      : isCompleted 
                      ? 'text-gray-800 font-medium' 
                      : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: DETAILS matching Image 2 */}
        {currentStep === 1 && (
          <form 
            id="tour-rda-details-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <FloatingSelect
                label="Product Name *"
                required
                value={formData.productName}
                onChange={handleProductChange}
              >
                <option value=""></option>
                <option value="TKB Goal Savings">TKB Goal Savings</option>
                {recurringDepositProducts?.filter(p => p.name !== 'TKB Goal Savings').map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </FloatingSelect>

              <div className="relative">
                <FloatingInput
                  label="Submitted On *"
                  required
                  value={formData.submittedOn}
                  onChange={(e) => setFormData({ ...formData, submittedOn: e.target.value })}
                  placeholder="MM/DD/YYYY"
                />
                <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
              </div>

              <FloatingSelect
                label="Field Officer"
                value={formData.fieldOfficer}
                onChange={(e) => setFormData({ ...formData, fieldOfficer: e.target.value })}
              >
                <option value=""></option>
                <option value="Unassigned">Unassigned</option>
                {users?.filter(u => u.username !== 'Unassigned' && u.name !== 'Unassigned').map(u => (
                  <option key={u.id} value={u.username || u.name}>{u.username || u.name}</option>
                ))}
              </FloatingSelect>

              <FloatingInput
                label="External id"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                disabled
                className="px-5 py-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-[3px] cursor-not-allowed select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-rda-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: TERMS */}
        {currentStep === 2 && (
          <form 
            id="tour-rda-terms-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <FloatingInput
                label="Currency"
                disabled
                value="Vietnamese Dong [VND]"
              />

              <FloatingInput
                label="Decimal Places"
                disabled
                value={formData.decimalPlaces}
              />

              <FloatingInput
                label="Currency in multiples of"
                disabled
                value={formData.currencyMultiplesOf}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-2">
              <FloatingSelect
                label="Interest Compounding Period *"
                value={formData.interestCompoundingPeriod}
                onChange={(e) => setFormData({ ...formData, interestCompoundingPeriod: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Posting Period *"
                value={formData.interestPostingPeriod}
                onChange={(e) => setFormData({ ...formData, interestPostingPeriod: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Calculated using *"
                value={formData.interestCalculationUsing}
                onChange={(e) => setFormData({ ...formData, interestCalculationUsing: e.target.value })}
              >
                <option value="Daily Balance">Daily Balance</option>
              </FloatingSelect>

              <FloatingSelect
                label="Days in Year *"
                value={formData.daysInYear}
                onChange={(e) => setFormData({ ...formData, daysInYear: e.target.value })}
              >
                <option value="365 Days">365 Days</option>
              </FloatingSelect>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-rda-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SETTINGS matching Image 3 */}
        {currentStep === 3 && (
          <form 
            id="tour-rda-settings-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2 text-xs"
          >
            {/* Top Checkboxes matching Image 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 pb-2">
              <label className="flex items-center space-x-2 text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMandatoryDeposit}
                  onChange={(e) => setFormData({ ...formData, isMandatoryDeposit: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#28a745] focus:ring-0"
                />
                <span className="font-semibold text-gray-900">Is Mandatory Deposit?</span>
              </label>

              <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.adjustAdvancePayments}
                  onChange={(e) => setFormData({ ...formData, adjustAdvancePayments: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba] focus:ring-0"
                />
                <span>Adjust advance payments toward future installments?</span>
              </label>

              <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowWithdrawals}
                  onChange={(e) => setFormData({ ...formData, allowWithdrawals: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba] focus:ring-0"
                />
                <span>Allow Withdrawals?</span>
              </label>
            </div>

            {/* Section: Lock-in Period */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Lock-in Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.lockinPeriodFrequency}
                  onChange={(e) => setFormData({ ...formData, lockinPeriodFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.lockinPeriodType}
                  onChange={(e) => setFormData({ ...formData, lockinPeriodType: e.target.value })}
                >
                  <option value=""></option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Section: Recurring Deposit Details matching Image 3 */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Recurring Deposit Details</h4>
              <div className="max-w-md">
                <FloatingInput
                  label="Recurring Deposit Amount *"
                  required
                  value={formData.recurringDepositAmount}
                  onChange={(e) => setFormData({ ...formData, recurringDepositAmount: e.target.value })}
                />
              </div>
            </div>

            {/* Section: Deposit Period matching Image 3 */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Deposit Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Deposit Period *"
                  required
                  value={formData.depositPeriod}
                  onChange={(e) => setFormData({ ...formData, depositPeriod: e.target.value })}
                />
                <FloatingSelect
                  label="Type *"
                  required
                  value={formData.depositPeriodType}
                  onChange={(e) => setFormData({ ...formData, depositPeriodType: e.target.value })}
                >
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 items-center pt-1">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.depositFrequencySameAsGroup}
                    onChange={(e) => setFormData({ ...formData, depositFrequencySameAsGroup: e.target.checked })}
                    className="rounded-[2px] border-gray-300 text-[#1072ba]"
                  />
                  <span>Deposit Frequency Same as Group/Center meeting</span>
                </label>

                <div className="relative">
                  <FloatingInput
                    label="Deposit Start Date *"
                    required
                    value={formData.depositStartDate}
                    onChange={(e) => setFormData({ ...formData, depositStartDate: e.target.value })}
                  />
                  <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Section: Deposit Frequency matching Image 3 */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Deposit Frequency</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Deposit Frequency *"
                  required
                  value={formData.depositFrequency}
                  onChange={(e) => setFormData({ ...formData, depositFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type *"
                  required
                  value={formData.depositFrequencyType}
                  onChange={(e) => setFormData({ ...formData, depositFrequencyType: e.target.value })}
                >
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Section: Minimum Deposit Term matching Image 3 */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Minimum Deposit Term</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.minDepositTermFrequency}
                  onChange={(e) => setFormData({ ...formData, minDepositTermFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Frequency Type"
                  value={formData.minDepositTermType}
                  onChange={(e) => setFormData({ ...formData, minDepositTermType: e.target.value })}
                >
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Section: And thereafter, in Multiples of */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">And thereafter, in Multiples of</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.inMultiplesOfFrequency}
                  onChange={(e) => setFormData({ ...formData, inMultiplesOfFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.inMultiplesOfType}
                  onChange={(e) => setFormData({ ...formData, inMultiplesOfType: e.target.value })}
                >
                  <option value=""></option>
                  <option value="Months">Months</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Section: Maximum Deposit Term */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">Maximum Deposit Term</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.maxDepositTermFrequency}
                  onChange={(e) => setFormData({ ...formData, maxDepositTermFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.maxDepositTermType}
                  onChange={(e) => setFormData({ ...formData, maxDepositTermType: e.target.value })}
                >
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Section: For Pre-mature closure */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-800">For Pre-mature closure</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 items-center">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.applyPenalInterest}
                    onChange={(e) => setFormData({ ...formData, applyPenalInterest: e.target.checked })}
                    className="rounded-[2px] border-gray-300 text-[#1072ba]"
                  />
                  <span>Apply Penal Interest (less)</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <FloatingInput
                  label="Penal Interest (%)"
                  value={formData.penalInterest}
                  onChange={(e) => setFormData({ ...formData, penalInterest: e.target.value })}
                />
                <FloatingSelect
                  label="Period"
                  value={formData.penalInterestPeriod}
                  onChange={(e) => setFormData({ ...formData, penalInterestPeriod: e.target.value })}
                >
                  <option value=""></option>
                  <option value="Months">Months</option>
                </FloatingSelect>
              </div>
              <div className="max-w-md pt-1">
                <FloatingInput
                  label="Minimum Balance For Interest Calculation"
                  value={formData.minBalanceForInterest}
                  onChange={(e) => setFormData({ ...formData, minBalanceForInterest: e.target.value })}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-rda-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: INTEREST RATE CHART */}
        {currentStep === 4 && (
          <form 
            id="tour-rda-chart-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="bg-[#fafbfc] border border-gray-200 rounded-[3px] p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div>
                  <span className="text-gray-500 font-medium">Chart Name:</span>
                  <span className="font-semibold text-gray-900 ml-2">{formData.chartName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Start Date:</span>
                  <span className="font-semibold text-gray-900 ml-2">{formData.chartFromDate}</span>
                </div>
              </div>

              {/* Slabs Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-[2px] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-medium">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Period</th>
                      <th className="py-2.5 px-4 font-medium">Amount Range</th>
                      <th className="py-2.5 px-4 font-medium">Annual Interest %</th>
                      <th className="py-2.5 px-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">1 - 12 Months</td>
                      <td className="py-3 px-4 text-gray-500">null - null</td>
                      <td className="py-3 px-4 font-semibold text-[#1072ba]">4</td>
                      <td className="py-3 px-4 text-gray-700">Goal Savings 12M - 4.0% p.a.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-rda-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: CHARGES */}
        {currentStep === 5 && (
          <form 
            id="tour-rda-charges-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="flex items-center space-x-6 max-w-lg">
              <div className="flex-1">
                <FloatingSelect
                  label="Charge"
                  value={formData.chargeId}
                  onChange={(e) => setFormData({ ...formData, chargeId: e.target.value })}
                >
                  <option value=""></option>
                </FloatingSelect>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="px-4 py-1.5 bg-[#e0e0e0] text-[#a0a0a0] text-xs font-medium rounded-[3px] shadow-2xs disabled:bg-[#e0e0e0] disabled:text-[#a0a0a0] disabled:cursor-not-allowed"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="py-8 text-center text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-[2px]">
              No charges configured for this recurring deposit product.
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-rda-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: PREVIEW */}
        {currentStep === 6 && (
          <div 
            id="tour-rda-preview-card"
            className="space-y-6 pt-2"
          >
            <div className="bg-white border border-gray-200 rounded-[3px] p-6 space-y-6 text-xs">
              
              {/* Client & Product Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Client:</span>
                  <span className="font-semibold text-gray-900">{clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Product:</span>
                  <span className="font-semibold text-[#1072ba]">{formData.productName || 'TKB Goal Savings'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Submitted On:</span>
                  <span className="font-medium text-gray-800">{formData.submittedOn || '10/13/2026'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">External ID:</span>
                  <span className="font-mono text-gray-800">{formData.externalId || 'TKB-RD-TDU-002'}</span>
                </div>
              </div>

              {/* Deposit Terms & Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Recurring Deposit Amount:</span>
                  <span className="font-semibold text-gray-900">₫500,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Deposit Period:</span>
                  <span className="font-medium text-gray-800">12 Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Deposit Frequency:</span>
                  <span className="font-medium text-gray-800">1 Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Interest Rate:</span>
                  <span className="font-semibold text-emerald-700">4.00 % p.a.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Compounding &amp; Posting:</span>
                  <span className="text-gray-800">Monthly / Monthly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Mandatory Deposit:</span>
                  <span className="font-semibold text-[#28a745]">Yes</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="tour-rda-submit-btn"
                onClick={handleSubmit}
                className="px-7 py-2 text-xs font-bold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
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
