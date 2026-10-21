import React, { useState, useEffect } from 'react';
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

export default function CreateFixedDepositAccountView({
  client,
  fixedDepositProducts = [],
  users = [],
  onSaveFixedDepositAccount,
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

  const clientName = client?.displayName || 'Minh Quang Tran';
  const defaultProduct = fixedDepositProducts.find(p => p.shortName === 'TKFD' || p.name?.toLowerCase().includes('fixed')) || fixedDepositProducts[0];

  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 2) - starts empty until user types or clicks autofill
    productName: '',
    productId: '',
    submittedOn: '',
    fieldOfficer: '',
    externalId: '',

    // Step 2: TERMS (Image 3)
    currency: 'VND',
    depositAmount: '',
    depositPeriod: '',
    depositPeriodType: '',
    compoundingPeriod: '',
    postingPeriod: '',
    interestCalculationType: '',
    daysInYear: '',

    // Step 3: SETTINGS (Image 4)
    lockinPeriodFrequency: '',
    lockinPeriodType: '',
    minDepositTermFrequency: '',
    minDepositTermType: '',
    inMultiplesOfFrequency: '',
    inMultiplesOfType: '',
    maxDepositTermFrequency: '',
    maxDepositTermType: '',
    transferInterestToSavings: false,
    maturityInstructions: '',
    applyPenalInterest: false,
    penalInterest: '',
    penalInterestPeriod: ''
  });

  // Listen to custom practice autofill and navigation events
  useEffect(() => {
    const handleAutofillStep1 = () => {
      setFormData(prev => ({
        ...prev,
        productName: 'TKB Fixed Deposit',
        productId: '1',
        submittedOn: '10/13/2026',
        fieldOfficer: 'Unassigned',
        externalId: 'TKB-FD-TDU-001'
      }));
    };

    const handleAutofillStep2 = () => {
      setFormData(prev => ({
        ...prev,
        currency: 'VND',
        depositAmount: '1,000,000.00',
        depositPeriod: '6',
        depositPeriodType: 'Months',
        compoundingPeriod: 'Monthly',
        postingPeriod: 'Monthly',
        interestCalculationType: 'Daily Balance',
        daysInYear: '365 Days'
      }));
    };

    const handleAutofillStep3 = () => {
      setFormData(prev => ({
        ...prev,
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '3',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '3',
        inMultiplesOfType: 'Months',
        maxDepositTermFrequency: '3',
        maxDepositTermType: 'Months',
        transferInterestToSavings: false,
        maturityInstructions: '',
        applyPenalInterest: false,
        penalInterest: '',
        penalInterestPeriod: ''
      }));
    };

    const handleNextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    };

    const handleSubmitEvent = () => {
      handleSubmitAccount();
    };

    window.addEventListener('practice-autofill-fda-step1', handleAutofillStep1);
    window.addEventListener('practice-autofill-fda-step2', handleAutofillStep2);
    window.addEventListener('practice-autofill-fda-step3', handleAutofillStep3);
    window.addEventListener('practice-next-fda-step', handleNextStep);
    window.addEventListener('practice-submit-fda', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-fda-step1', handleAutofillStep1);
      window.removeEventListener('practice-autofill-fda-step2', handleAutofillStep2);
      window.removeEventListener('practice-autofill-fda-step3', handleAutofillStep3);
      window.removeEventListener('practice-next-fda-step', handleNextStep);
      window.removeEventListener('practice-submit-fda', handleSubmitEvent);
    };
  }, [formData, client]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitAccount = (e) => {
    if (e) e.preventDefault();

    const cleanDeposit = parseFloat(String(formData.depositAmount).replace(/,/g, '')) || 1000000;
    const newFdAccount = {
      id: String(Date.now()),
      accountNo: '000000003',
      clientId: client?.id || '11',
      clientName: clientName,
      productId: formData.productId || '1',
      productName: formData.productName || 'TKB Fixed Deposit',
      accountType: 'Fixed Deposit',
      externalId: formData.externalId || 'TKB-FD-TDU-001',
      status: 'Not Activated',
      activatedOn: 'Not Activated',
      fieldOfficer: formData.fieldOfficer || 'Unassigned',
      submittedDate: formData.submittedOn || '10/13/2026',
      openedDate: '2026-10-13',
      lastActive: '13 October 2026',
      balance: cleanDeposit,
      principal: cleanDeposit,
      depositPeriod: `${formData.depositPeriod || '6'} ${formData.depositPeriodType || 'Months'}`,
      maturityDate: '13 April 2027',
      maturityAmount: 1022653,
      interestRate: 4.5,
      interestCompoundingPeriod: formData.compoundingPeriod || 'Monthly',
      interestPostingPeriod: formData.postingPeriod || 'Monthly',
      interestCalculatedUsing: formData.interestCalculationType || 'Daily Balance',
      daysInYear: formData.daysInYear || '365 Days',
      lockinPeriod: formData.lockinPeriodFrequency ? `${formData.lockinPeriodFrequency} ${formData.lockinPeriodType}` : null,
      transferInterestToSavings: formData.transferInterestToSavings
    };

    if (onSaveFixedDepositAccount) {
      onSaveFixedDepositAccount(newFdAccount);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumb matching Image 2 */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Create Fixed Deposit Account
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
          <span 
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Fixed Deposits
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create Fixed Deposit Account</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-7">
        
        {/* Stepper Header (6 steps) */}
        <div id="tour-fda-stepper" className="relative flex items-center justify-between px-4 pt-1 pb-4">
          <div className="absolute left-8 right-8 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {steps.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <div 
                key={st.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  if (isCompleted || currentStep > st.id) {
                    setCurrentStep(st.id);
                  }
                }}
              >
                {/* Circle Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                  isActive
                    ? 'bg-[#1072ba] text-white ring-4 ring-sky-100'
                    : isCompleted
                      ? 'bg-[#28a745] text-white'
                      : 'bg-gray-400 text-white'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isActive ? (
                    <Pencil className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-white/80" />
                  )}
                </div>

                {/* Step Label */}
                <span className={`text-[10px] font-semibold tracking-wider mt-1.5 uppercase text-center ${
                  isActive
                    ? 'text-gray-900 font-bold'
                    : isCompleted
                      ? 'text-gray-700'
                      : 'text-gray-400'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab 1: DETAILS matching Image 2 */}
        {currentStep === 1 && (
          <form 
            id="tour-fda-details-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Row 1: Product Name * & Submitted On * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Product Name *"
                required
                value={formData.productName}
                onChange={(e) => {
                  const val = e.target.value;
                  const prod = fixedDepositProducts.find(p => p.name === val);
                  setFormData({ ...formData, productName: val, productId: prod?.id || '1' });
                }}
              >
                <option value=""></option>
                <option value="TKB Fixed Deposit">TKB Fixed Deposit</option>
                {fixedDepositProducts.filter(p => p.name !== 'TKB Fixed Deposit').map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </FloatingSelect>

              <FloatingInput
                label="Submitted On *"
                required
                value={formData.submittedOn}
                onChange={(e) => setFormData({ ...formData, submittedOn: e.target.value })}
                rightIcon={<Calendar className="w-3.5 h-3.5" />}
              />
            </div>

            {/* Row 2: Field Officer & External id */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Field Officer"
                value={formData.fieldOfficer}
                onChange={(e) => setFormData({ ...formData, fieldOfficer: e.target.value })}
              >
                <option value=""></option>
                <option value="Unassigned">Unassigned</option>
                <option value="Dang, Quan">Dang, Quan</option>
                {users.map(u => (
                  <option key={u.id} value={`${u.lastname}, ${u.firstname}`}>
                    {u.lastname}, {u.firstname}
                  </option>
                ))}
              </FloatingSelect>

              <FloatingInput
                label="External id"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                disabled
                className="bg-gray-100 text-gray-400 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 cursor-not-allowed select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="submit"
                id="tour-fda-details-next-btn"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next</span>
                <span className="text-gray-600">&rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: TERMS matching Image 3 */}
        {currentStep === 2 && (
          <form 
            id="tour-fda-terms-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Row 1: Deposit Amount * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingInput
                label="Deposit Amount *"
                required
                prefix="VND"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
              />
              <div />
            </div>

            {/* Row 2: Deposit Period * & Deposit Period Type * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingInput
                label="Deposit Period *"
                required
                value={formData.depositPeriod}
                onChange={(e) => setFormData({ ...formData, depositPeriod: e.target.value })}
              />

              <FloatingSelect
                label="Deposit Period Type *"
                required
                value={formData.depositPeriodType}
                onChange={(e) => setFormData({ ...formData, depositPeriodType: e.target.value })}
              >
                <option value=""></option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </FloatingSelect>
            </div>

            {/* Row 3: Interest Compounding Period * & Interest Posting Period * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Interest Compounding Period *"
                required
                value={formData.compoundingPeriod}
                onChange={(e) => setFormData({ ...formData, compoundingPeriod: e.target.value })}
              >
                <option value=""></option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Posting Period *"
                required
                value={formData.postingPeriod}
                onChange={(e) => setFormData({ ...formData, postingPeriod: e.target.value })}
              >
                <option value=""></option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="BiAnnual">BiAnnual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>
            </div>

            {/* Row 4: Interest Calculated using * & Days in Year * */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Interest Calculated using *"
                required
                value={formData.interestCalculationType}
                onChange={(e) => setFormData({ ...formData, interestCalculationType: e.target.value })}
              >
                <option value=""></option>
                <option value="Daily Balance">Daily Balance</option>
                <option value="Average Daily Balance">Average Daily Balance</option>
              </FloatingSelect>

              <FloatingSelect
                label="Days in Year *"
                required
                value={formData.daysInYear}
                onChange={(e) => setFormData({ ...formData, daysInYear: e.target.value })}
              >
                <option value=""></option>
                <option value="360 Days">360 Days</option>
                <option value="365 Days">365 Days</option>
              </FloatingSelect>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="submit"
                id="tour-fda-terms-next-btn"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next</span>
                <span className="text-gray-600">&rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: SETTINGS matching Image 4 */}
        {currentStep === 3 && (
          <form 
            id="tour-fda-settings-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Lock-in Period */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Lock-in Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Minimum Deposit Term */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Minimum Deposit Term
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                  <option value=""></option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* And thereafter, in Multiples of */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                And thereafter, in Multiples of
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Maximum Deposit Term */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Maximum Deposit Term
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                  <option value=""></option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Interest Transfer Checkbox */}
            <div className="flex items-center space-x-6 pt-2">
              <span className="text-xs font-semibold text-gray-700 w-36">
                Interest Transfer
              </span>
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <span>Transfer Interest to Linked Savings Account?</span>
                <input
                  type="checkbox"
                  checked={formData.transferInterestToSavings}
                  onChange={(e) => setFormData({ ...formData, transferInterestToSavings: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba]"
                />
              </label>
            </div>

            {/* Maturity Instructions */}
            <div className="pt-2">
              <FloatingSelect
                label="Maturity Instructions"
                value={formData.maturityInstructions}
                onChange={(e) => setFormData({ ...formData, maturityInstructions: e.target.value })}
              >
                <option value=""></option>
                <option value="Rollover Principal and Interest">Rollover Principal and Interest</option>
                <option value="Rollover Principal Only">Rollover Principal Only</option>
                <option value="Close on Maturity">Close on Maturity</option>
              </FloatingSelect>
            </div>

            {/* For Pre-mature closure */}
            <div className="pt-2">
              <div className="flex items-center space-x-6 mb-3">
                <span className="text-xs font-semibold text-gray-700 w-36">
                  For Pre-mature closure
                </span>
                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <span>Apply Penal Interest (less)</span>
                  <input
                    type="checkbox"
                    checked={formData.applyPenalInterest}
                    onChange={(e) => setFormData({ ...formData, applyPenalInterest: e.target.checked })}
                    className="rounded-[2px] border-gray-300 text-[#1072ba]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Penal Interest (%)"
                  disabled={!formData.applyPenalInterest}
                  value={formData.penalInterest}
                  onChange={(e) => setFormData({ ...formData, penalInterest: e.target.value })}
                />
                <FloatingSelect
                  label="Period"
                  disabled={!formData.applyPenalInterest}
                  value={formData.penalInterestPeriod}
                  onChange={(e) => setFormData({ ...formData, penalInterestPeriod: e.target.value })}
                >
                  <option value=""></option>
                  <option value="Whole Term">Whole Term</option>
                  <option value="Till Premature Date">Till Premature Date</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="submit"
                id="tour-fda-settings-next-btn"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next</span>
                <span className="text-gray-600">&rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: INTEREST RATE CHART */}
        {currentStep === 4 && (
          <div 
            id="tour-fda-chart-form"
            className="space-y-6 pt-2"
          >
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1072ba] uppercase tracking-wider block">
                  Biểu Lãi Suất Áp Dụng: TKB FD VND Interest Rates 2026
                </span>
                <span className="text-[11px] text-gray-600">
                  Hiệu lực từ ngày: 9/1/2026 &bull; Kỳ hạn khách hàng chọn: <strong>6 Tháng</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-500 block">Lãi suất hiệu lực:</span>
                <span className="text-base font-bold text-[#28a745]">4.5% p.a.</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Kỳ hạn (Period)</th>
                    <th className="py-2.5 px-4 font-semibold">Bậc số tiền (Amount Range)</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Lãi suất (%/năm)</th>
                    <th className="py-2.5 px-4 font-semibold">Mô tả sản phẩm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-2.5 px-4">1 - 3 Months</td>
                    <td className="py-2.5 px-4 text-gray-500">Mọi số tiền</td>
                    <td className="py-2.5 px-4 text-center font-medium">3.5%</td>
                    <td className="py-2.5 px-4 text-gray-600">FD 3M - 3.5% p.a.</td>
                  </tr>
                  <tr className="bg-sky-50/70 border-l-4 border-l-[#1072ba] font-medium">
                    <td className="py-2.5 px-4 text-[#1072ba] font-bold">
                      4 - 6 Months [Áp dụng cho HĐ này]
                    </td>
                    <td className="py-2.5 px-4 text-gray-700">Mọi số tiền</td>
                    <td className="py-2.5 px-4 text-center text-[#1072ba] font-bold text-sm">4.5%</td>
                    <td className="py-2.5 px-4 text-gray-700">FD 6M - 4.5% p.a.</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2.5 px-4">7 - 9 Months</td>
                    <td className="py-2.5 px-4 text-gray-500">Mọi số tiền</td>
                    <td className="py-2.5 px-4 text-center font-medium">5.0%</td>
                    <td className="py-2.5 px-4 text-gray-600">FD 9M - 5.0% p.a.</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2.5 px-4">10 - 12 Months</td>
                    <td className="py-2.5 px-4 text-gray-500">Mọi số tiền</td>
                    <td className="py-2.5 px-4 text-center font-medium">5.5%</td>
                    <td className="py-2.5 px-4 text-gray-600">FD 12M - 5.5% p.a.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-fda-chart-next-btn"
                onClick={handleNext}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next</span>
                <span className="text-gray-600">&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: CHARGES */}
        {currentStep === 5 && (
          <div 
            id="tour-fda-charges-form"
            className="space-y-6 pt-2"
          >
            <div className="border border-dashed border-gray-300 rounded-[2px] p-8 text-center bg-gray-50/50">
              <p className="text-xs text-gray-500 font-medium">
                Sản phẩm Tiết kiệm có kỳ hạn TKB Fixed Deposit không áp dụng biểu phí dịch vụ phát sinh.
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Khách hàng được miễn phí hoàn toàn khi mở tài khoản và tất toán đúng hạn.
              </p>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-fda-charges-next-btn"
                onClick={handleNext}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next</span>
                <span className="text-gray-600">&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: PREVIEW */}
        {currentStep === 6 && (
          <div 
            id="tour-fda-preview-card"
            className="space-y-6 pt-2"
          >
            <div className="border border-gray-200 rounded-[2px] overflow-hidden">
              <div className="bg-[#f8f9fa] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Rà Soát Thông Tin Mở Tài Khoản Tiết Kiệm Có Kỳ Hạn
                </span>
                <span className="text-xs font-bold text-[#1072ba]">
                  TKB Fixed Deposit (000000003)
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Khách hàng:</span>
                    <span className="font-semibold text-gray-900">{clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Sản phẩm:</span>
                    <span className="font-semibold text-[#1072ba]">{formData.productName || 'TKB Fixed Deposit'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Ngày lập hồ sơ:</span>
                    <span className="font-semibold text-gray-900">{formData.submittedOn || '10/13/2026'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Mã hồ sơ (External ID):</span>
                    <span className="font-mono font-semibold text-gray-900">{formData.externalId || 'TKB-FD-TDU-001'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Số tiền gốc gửi:</span>
                    <span className="font-bold text-[#1072ba]">đ{formData.depositAmount || '1,000,000.00'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Kỳ hạn gửi:</span>
                    <span className="font-semibold text-gray-900">{formData.depositPeriod || '6'} Tháng (Maturity: 13 April 2027)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Lãi suất áp dụng:</span>
                    <span className="font-bold text-[#28a745]">4.5% / năm (Bậc 4 - 6 Tháng)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Số tiền đáo hạn dự tính:</span>
                    <span className="font-bold text-[#28a745]">đ1,022,653.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-fda-submit-btn"
                onClick={handleSubmitAccount}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-6 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
