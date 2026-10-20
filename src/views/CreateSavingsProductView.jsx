import React, { useState, useEffect } from 'react';
import { Pencil, Check, Plus, Trash2, Eye } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style matching screenshot)
 * When empty & unfocused: label acts as placeholder at the input baseline.
 * When focused or has value: label smoothly floats upwards and shrinks.
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
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
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-4 pt-0.5"
      />
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
        value={value ?? ''}
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

export default function CreateSavingsProductView({
  glAccounts = [],
  onSaveProduct,
  onCancel,
  onNavigateHome,
  onNavigateProducts,
  onNavigateSavingsProducts
}) {
  // Current active step:
  // 1: DETAILS, 2: CURRENCY, 3: TERMS, 4: SETTINGS, 5: CHARGES, 6: ACCOUNTING, 7: PREVIEW
  const [currentStep, setCurrentStep] = useState(1);
  
  // Per user instruction: "tab preview chỉ xuất hiện khi user nhập xong tab term"
  const [hasCompletedTerms, setHasCompletedTerms] = useState(false);

  // Form State: Starts empty ("chưa có input") as requested by user
  const [formData, setFormData] = useState({
    // Step 1: DETAILS
    name: '',
    shortName: '',
    description: '',

    // Step 2: CURRENCY
    currencyCode: '',
    decimalPlaces: '',
    currencyMultiplesOf: '',

    // Step 3: TERMS
    nominalAnnualInterestRate: '',
    interestCompoundingPeriodType: '',
    interestPostingPeriodType: '',
    interestCalculationType: '',
    interestCalculationDaysInYearType: '',

    // Step 4: SETTINGS (matching Image 1)
    minRequiredOpeningBalance: '',
    lockinPeriodFrequency: '',
    lockinPeriodFrequencyType: '',
    withdrawalFeeForTransfers: false,
    balanceRequiredForInterestCalculation: '',
    enforceMinRequiredBalance: false,
    minRequiredBalance: '',
    isWithholdTaxApplicable: false,
    allowOverdraft: false,
    enableDormancyTracking: false,

    // Step 5: CHARGES (matching Image 2)
    selectedChargeId: '',
    charges: [],

    // Step 6: ACCOUNTING (matching Image 5)
    accountingRule: 'None', // 'None', 'Cash', 'Accrual (periodic)'
    savingsReferenceAccountId: '',
    overdraftPortfolioControlId: '',
    savingsControlAccountId: '',
    transfersInSuspenseAccountId: '',
    interestOnSavingsAccountId: '',
    writeOffAccountId: '',
    incomeFromFeeAccountId: '',
    incomeFromPenaltyAccountId: '',
    overdraftInterestIncomeAccountId: '',
    advancedAccountingRules: false
  });

  // Base 6 steps, with Step 7 (PREVIEW) appearing ONLY after completing TERMS
  const baseSteps = [
    { id: 1, key: 'details', label: 'DETAILS' },
    { id: 2, key: 'currency', label: 'CURRENCY' },
    { id: 3, key: 'terms', label: 'TERMS' },
    { id: 4, key: 'settings', label: 'SETTINGS' },
    { id: 5, key: 'charges', label: 'CHARGES' },
    { id: 6, key: 'accounting', label: 'ACCOUNTING' }
  ];

  const visibleSteps = hasCompletedTerms 
    ? [...baseSteps, { id: 7, key: 'preview', label: 'PREVIEW' }]
    : baseSteps;

  // Available Charges in system for Step 5 dropdown
  const availableCharges = [
    { id: '1', name: 'Account Maintenance Fee', type: 'Flat', amount: 11000, collectedOn: 'Monthly' },
    { id: '2', name: 'Overdraft Fee', type: 'Percentage', amount: 2, collectedOn: 'Annual' },
    { id: '3', name: 'Withdrawal Fee', type: 'Flat', amount: 5000, collectedOn: 'Per Withdrawal' },
    { id: '4', name: 'SMS Banking Notification Fee', type: 'Flat', amount: 8800, collectedOn: 'Monthly' }
  ];

  // Quick autofill sample from Images 1, 2, 3, 4, 5: TKB Current Account (TKCA)
  const handleQuickAutofillSample = () => {
    const cashRef = glAccounts.find(g => g.glCode === '110201' || g.name.toLowerCase().includes('settlement')) || glAccounts[0];
    const overdraftAcc = glAccounts.find(g => g.glCode === '120101' || g.name.toLowerCase().includes('retail loan')) || glAccounts[1];
    const savingsCtrl = glAccounts.find(g => g.glCode === '210102' || g.name.toLowerCase().includes('current account deposits')) || glAccounts[2];
    const suspenseAcc = glAccounts.find(g => g.glCode === '220201' || g.name.toLowerCase().includes('clearing payable')) || glAccounts[3];
    const interestExp = glAccounts.find(g => g.glCode === '510101' || g.name.toLowerCase().includes('savings interest')) || glAccounts[4];
    const writeOffAcc = glAccounts.find(g => g.glCode === '520101' || g.name.toLowerCase().includes('write-off')) || glAccounts[4];
    const feeInc = glAccounts.find(g => g.glCode === '420102' || g.name.toLowerCase().includes('savings service fee')) || glAccounts[5];
    const penaltyInc = glAccounts.find(g => g.glCode === '420103' || g.name.toLowerCase().includes('penalty')) || glAccounts[6];
    const overdraftInterestInc = glAccounts.find(g => g.glCode === '410101' || g.name.toLowerCase().includes('loan interest income')) || glAccounts[5];

    setFormData({
      // Step 1: DETAILS
      name: 'TKB Current Account',
      shortName: 'TKCA',
      description: 'Basic VND CASA Product · Demo',

      // Step 2: CURRENCY
      currencyCode: 'VND',
      decimalPlaces: '0',
      currencyMultiplesOf: '1',

      // Step 3: TERMS
      nominalAnnualInterestRate: '0',
      interestCompoundingPeriodType: 'Daily',
      interestPostingPeriodType: 'Monthly',
      interestCalculationType: 'Daily Balance',
      interestCalculationDaysInYearType: '365 Days',

      // Step 4: SETTINGS
      minRequiredOpeningBalance: '0',
      lockinPeriodFrequency: '',
      lockinPeriodFrequencyType: '',
      withdrawalFeeForTransfers: false,
      balanceRequiredForInterestCalculation: '',
      enforceMinRequiredBalance: false,
      minRequiredBalance: '',
      isWithholdTaxApplicable: false,
      allowOverdraft: false,
      enableDormancyTracking: false,

      // Step 5: CHARGES
      selectedChargeId: '',
      charges: [],

      // Step 6: ACCOUNTING
      accountingRule: 'Cash',
      savingsReferenceAccountId: cashRef ? String(cashRef.id) : '1',
      overdraftPortfolioControlId: overdraftAcc ? String(overdraftAcc.id) : '2',
      savingsControlAccountId: savingsCtrl ? String(savingsCtrl.id) : '3',
      transfersInSuspenseAccountId: suspenseAcc ? String(suspenseAcc.id) : '4',
      interestOnSavingsAccountId: interestExp ? String(interestExp.id) : '5',
      writeOffAccountId: writeOffAcc ? String(writeOffAcc.id) : '6',
      incomeFromFeeAccountId: feeInc ? String(feeInc.id) : '7',
      incomeFromPenaltyAccountId: penaltyInc ? String(penaltyInc.id) : '8',
      overdraftInterestIncomeAccountId: overdraftInterestInc ? String(overdraftInterestInc.id) : '9',
      advancedAccountingRules: false
    });

    setHasCompletedTerms(true);
  };

  // Custom Event Listeners for Step-by-Step Guided Practice Tour
  useEffect(() => {
    const handleFillDetails = () => {
      setFormData(prev => ({
        ...prev,
        name: 'TKB Current Account',
        shortName: 'TKCA',
        description: 'Basic VND CASA Product · Demo'
      }));
      setCurrentStep(2);
    };

    const handleFillCurrency = () => {
      setFormData(prev => ({
        ...prev,
        currencyCode: 'VND',
        decimalPlaces: '0',
        currencyMultiplesOf: '1'
      }));
      setCurrentStep(3);
    };

    const handleFillTerms = () => {
      setFormData(prev => ({
        ...prev,
        nominalAnnualInterestRate: '0',
        interestCompoundingPeriodType: 'Daily',
        interestPostingPeriodType: 'Monthly',
        interestCalculationType: 'Daily Balance',
        interestCalculationDaysInYearType: '365 Days'
      }));
      setHasCompletedTerms(true);
      setCurrentStep(4);
    };

    const handleFillSettings = () => {
      setFormData(prev => ({
        ...prev,
        minRequiredOpeningBalance: '0',
        lockinPeriodFrequency: '',
        lockinPeriodFrequencyType: '',
        withdrawalFeeForTransfers: false,
        balanceRequiredForInterestCalculation: '',
        enforceMinRequiredBalance: false,
        minRequiredBalance: '',
        isWithholdTaxApplicable: false,
        allowOverdraft: false,
        enableDormancyTracking: false
      }));
      setCurrentStep(6);
    };

    const handleFillAccounting = () => {
      const cashRef = glAccounts.find(g => g.glCode === '110201' || g.name.toLowerCase().includes('settlement')) || glAccounts[0];
      const overdraftAcc = glAccounts.find(g => g.glCode === '120101' || g.name.toLowerCase().includes('retail loan')) || glAccounts[1];
      const savingsCtrl = glAccounts.find(g => g.glCode === '210102' || g.name.toLowerCase().includes('current account deposits')) || glAccounts[2];
      const suspenseAcc = glAccounts.find(g => g.glCode === '220201' || g.name.toLowerCase().includes('clearing payable')) || glAccounts[3];
      const interestExp = glAccounts.find(g => g.glCode === '510101' || g.name.toLowerCase().includes('savings interest')) || glAccounts[4];
      const writeOffAcc = glAccounts.find(g => g.glCode === '520101' || g.name.toLowerCase().includes('write-off')) || glAccounts[4];
      const feeInc = glAccounts.find(g => g.glCode === '420102' || g.name.toLowerCase().includes('savings service fee')) || glAccounts[5];
      const penaltyInc = glAccounts.find(g => g.glCode === '420103' || g.name.toLowerCase().includes('penalty')) || glAccounts[6];
      const overdraftInterestInc = glAccounts.find(g => g.glCode === '410101' || g.name.toLowerCase().includes('loan interest income')) || glAccounts[5];

      setFormData(prev => ({
        ...prev,
        accountingRule: 'Cash',
        savingsReferenceAccountId: cashRef ? String(cashRef.id) : '1',
        overdraftPortfolioControlId: overdraftAcc ? String(overdraftAcc.id) : '2',
        savingsControlAccountId: savingsCtrl ? String(savingsCtrl.id) : '3',
        transfersInSuspenseAccountId: suspenseAcc ? String(suspenseAcc.id) : '4',
        interestOnSavingsAccountId: interestExp ? String(interestExp.id) : '5',
        writeOffAccountId: writeOffAcc ? String(writeOffAcc.id) : '6',
        incomeFromFeeAccountId: feeInc ? String(feeInc.id) : '7',
        incomeFromPenaltyAccountId: penaltyInc ? String(penaltyInc.id) : '8',
        overdraftInterestIncomeAccountId: overdraftInterestInc ? String(overdraftInterestInc.id) : '9',
        advancedAccountingRules: false
      }));
      setHasCompletedTerms(true);
      setCurrentStep(7);
    };

    const handleFillAll = () => {
      handleQuickAutofillSample();
      setCurrentStep(7);
    };

    const handleSubmitEvent = () => {
      handleFinalSubmit();
    };

    window.addEventListener('practice-fill-casa-details', handleFillDetails);
    window.addEventListener('practice-fill-casa-currency', handleFillCurrency);
    window.addEventListener('practice-fill-casa-terms', handleFillTerms);
    window.addEventListener('practice-fill-casa-settings', handleFillSettings);
    window.addEventListener('practice-fill-casa-accounting', handleFillAccounting);
    window.addEventListener('practice-fill-casa-all', handleFillAll);
    window.addEventListener('practice-submit-casa', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-fill-casa-details', handleFillDetails);
      window.removeEventListener('practice-fill-casa-currency', handleFillCurrency);
      window.removeEventListener('practice-fill-casa-terms', handleFillTerms);
      window.removeEventListener('practice-fill-casa-settings', handleFillSettings);
      window.removeEventListener('practice-fill-casa-accounting', handleFillAccounting);
      window.removeEventListener('practice-fill-casa-all', handleFillAll);
      window.removeEventListener('practice-submit-casa', handleSubmitEvent);
    };
  }, [glAccounts]);

  // Step 1 Next handler
  const handleNextStep1 = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.shortName.trim()) {
      alert('Please fill in required fields: Product Name and Short Name.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Next handler
  const handleNextStep2 = (e) => {
    if (e) e.preventDefault();
    if (!formData.currencyCode) {
      alert('Please select a Currency.');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Next handler -> Unlocks PREVIEW step!
  const handleNextStep3 = () => {
    setHasCompletedTerms(true);
    setCurrentStep(4);
  };

  // Step 4 Next handler
  const handleNextStep4 = () => setCurrentStep(5);

  // Step 5 Next handler
  const handleNextStep5 = () => setCurrentStep(6);

  // Step 6 Next handler -> Moves to Step 7 (PREVIEW)
  const handleNextStep6 = () => setCurrentStep(7);

  // Add Charge in Step 5
  const handleAddCharge = () => {
    if (!formData.selectedChargeId) return;
    const ch = availableCharges.find(c => c.id === formData.selectedChargeId);
    if (!ch) return;
    if (formData.charges.some(c => c.id === ch.id)) return; // already added

    setFormData(prev => ({
      ...prev,
      charges: [...prev.charges, ch],
      selectedChargeId: ''
    }));
  };

  // Final Submit handler
  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.shortName.trim()) {
      alert('Please fill in required fields: Product Name and Short Name.');
      setCurrentStep(1);
      return;
    }

    const newProduct = {
      id: String(Date.now()),
      name: formData.name,
      shortName: formData.shortName,
      description: formData.description,
      currencyCode: formData.currencyCode || 'VND',
      depositType: 'Savings (Tiền gửi thanh toán)',
      depositTypeId: '100',
      nominalAnnualInterestRate: parseFloat(formData.nominalAnnualInterestRate) || 0.0,
      minBalanceForInterest: parseFloat(formData.minRequiredOpeningBalance) || 0.0,
      accountingRule: formData.accountingRule === 'Cash' ? 'Cash Based' : (formData.accountingRule === 'Accrual (periodic)' ? 'Accrual (periodic)' : 'None'),
      charges: formData.charges,
      glAccounts: {
        savingsReferenceAccountId: formData.savingsReferenceAccountId,
        overdraftPortfolioControlId: formData.overdraftPortfolioControlId,
        savingsControlAccountId: formData.savingsControlAccountId,
        transfersInSuspenseAccountId: formData.transfersInSuspenseAccountId,
        interestOnSavingsAccountId: formData.interestOnSavingsAccountId,
        incomeFromFeeAccountId: formData.incomeFromFeeAccountId,
        incomeFromPenaltyAccountId: formData.incomeFromPenaltyAccountId
      }
    };

    if (onSaveProduct) {
      onSaveProduct(newProduct);
    }
  };

  // Currency display name
  const currencyDisplayMap = {
    'VND': 'Vietnamese Dong',
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'CNY': 'Chinese Yuan Renminbi'
  };
  const currencyDisplayName = currencyDisplayMap[formData.currencyCode] || formData.currencyCode || 'Vietnamese Dong';

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1 & Image 4: Create | Home / Products / Saving Products / Create */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Create
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
              onClick={onNavigateProducts} 
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Products
            </span>
            <span className="text-gray-400">/</span>
            <span 
              onClick={onNavigateSavingsProducts} 
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Saving Products
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Create</span>
          </div>
        </div>

        {/* Quick autofill helper */}
        <button
          type="button"
          onClick={handleQuickAutofillSample}
          className="text-xs text-[#1072ba] hover:bg-sky-50 px-2.5 py-1 rounded border border-sky-200 font-medium transition-colors cursor-pointer"
          title="Điền nhanh dữ liệu mẫu theo hình: TKB Current Account (TKCA)"
        >
          Điền nhanh mẫu (TKB Current Account - TKCA)
        </button>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header (Notice: PREVIEW only appears after user finishes TERMS, matching user request) */}
        <div className="relative flex items-center justify-between px-6 pt-1 pb-4">
          {/* Horizontal connecting line */}
          <div className="absolute left-10 right-10 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {visibleSteps.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;
            const isPreview = st.id === 7;

            return (
              <div 
                key={st.id}
                onClick={() => {
                  if (isCompleted || (formData.name && formData.shortName)) {
                    setCurrentStep(st.id);
                  }
                }}
                className={`flex flex-col items-center z-10 cursor-pointer ${
                  isActive ? 'px-2 py-1 -my-1 rounded-[2px]' : ''
                }`}
              >
                {/* Circle Icon */}
                {isActive ? (
                  /* Active: Blue circle with Pencil (or Eye for Preview matching Image 4) */
                  <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                    {isPreview ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                  </div>
                ) : isCompleted ? (
                  /* Completed: Green circle with Checkmark matching Image 1, 2, 3, 4 */
                  <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  /* Pending: Green check if preview unlocked, or gray circle matching screenshot */
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-2xs ${
                    isPreview ? 'bg-[#28a745] text-white' : 'bg-[#808080] text-white'
                  }`}>
                    {isPreview ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Pencil className="w-3.5 h-3.5" />}
                  </div>
                )}

                {/* Step Label */}
                <span className={`text-[11px] font-semibold tracking-wider mt-1.5 uppercase ${
                  isActive ? 'text-gray-900 font-bold' : 'text-gray-600'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DETAILS                                                */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 1 && (
          <form id="tour-casa-form-details" onSubmit={handleNextStep1} className="space-y-7 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Product Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <FloatingInput
                label="Short Name *"
                required
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div />
            </div>

            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                disabled
                className="bg-[#eaedf1] text-[#9e9e9e] text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 cursor-not-allowed shadow-2xs select-none"
              >
                <span>&larr; Previous</span>
              </button>

              {/* Details Next button */}
              <button
                type="submit"
                id="tour-casa-details-next-btn"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: CURRENCY                                               */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 2 && (
          <form id="tour-casa-form-currency" onSubmit={handleNextStep2} className="space-y-7 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingSelect
                label="Currency *"
                required
                value={formData.currencyCode}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
              >
                <option value=""></option>
                <option value="VND">Vietnamese Dong</option>
                <option value="USD">US Dollar</option>
                <option value="EUR">Euro</option>
                <option value="CNY">Chinese Yuan Renminbi</option>
              </FloatingSelect>

              <FloatingInput
                label="Decimal Places *"
                required
                type="number"
                value={formData.decimalPlaces}
                onChange={(e) => setFormData({ ...formData, decimalPlaces: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Currency in multiples of"
                type="number"
                value={formData.currencyMultiplesOf}
                onChange={(e) => setFormData({ ...formData, currencyMultiplesOf: e.target.value })}
              />
              <div />
            </div>

            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              {/* Currency Next button */}
              <button
                type="submit"
                id="tour-casa-currency-next-btn"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: TERMS                                                  */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div id="tour-casa-form-terms" className="space-y-7 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Nominal Annual Interest *"
                type="number"
                value={formData.nominalAnnualInterestRate}
                onChange={(e) => setFormData({ ...formData, nominalAnnualInterestRate: e.target.value })}
              />

              <FloatingSelect
                label="Interest Compounding Period *"
                value={formData.interestCompoundingPeriodType}
                onChange={(e) => setFormData({ ...formData, interestCompoundingPeriodType: e.target.value })}
              >
                <option value=""></option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </FloatingSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingSelect
                label="Interest Posting Period *"
                value={formData.interestPostingPeriodType}
                onChange={(e) => setFormData({ ...formData, interestPostingPeriodType: e.target.value })}
              >
                <option value=""></option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Bi-Annual">Bi-Annual</option>
                <option value="Annual">Annual</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Calculated using *"
                value={formData.interestCalculationType}
                onChange={(e) => setFormData({ ...formData, interestCalculationType: e.target.value })}
              >
                <option value=""></option>
                <option value="Daily Balance">Daily Balance</option>
                <option value="Average Daily Balance">Average Daily Balance</option>
              </FloatingSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingSelect
                label="Days in Year *"
                value={formData.interestCalculationDaysInYearType}
                onChange={(e) => setFormData({ ...formData, interestCalculationDaysInYearType: e.target.value })}
              >
                <option value=""></option>
                <option value="365 Days">365 Days</option>
                <option value="360 Days">360 Days</option>
              </FloatingSelect>
              <div />
            </div>

            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-casa-terms-next-btn"
                onClick={handleNextStep3}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SETTINGS (Exact match to Image 1)                      */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div id="tour-casa-form-settings" className="space-y-7 pt-2">
            
            {/* Row 1: Minimum Opening Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Minimum Opening Balance"
                type="number"
                value={formData.minRequiredOpeningBalance}
                onChange={(e) => setFormData({ ...formData, minRequiredOpeningBalance: e.target.value })}
              />
              <div />
            </div>

            {/* Row 2: Lock-in Period & Frequency dropdown matching Image 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput
                label="Lock-in Period"
                type="number"
                value={formData.lockinPeriodFrequency}
                onChange={(e) => setFormData({ ...formData, lockinPeriodFrequency: e.target.value })}
              />

              <FloatingSelect
                label=""
                value={formData.lockinPeriodFrequencyType}
                onChange={(e) => setFormData({ ...formData, lockinPeriodFrequencyType: e.target.value })}
              >
                <option value=""></option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </FloatingSelect>
            </div>

            {/* Row 3: Apply Withdrawal Fee for Transfers (Col 1), Balance Required for Interest Calculation (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="flex items-center space-x-2 pb-1.5">
                <span className="text-xs text-gray-700">Apply Withdrawal Fee for Transfers</span>
                <input
                  type="checkbox"
                  checked={formData.withdrawalFeeForTransfers}
                  onChange={(e) => setFormData({ ...formData, withdrawalFeeForTransfers: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>

              <FloatingInput
                label="Balance Required for Interest Calculation"
                type="number"
                value={formData.balanceRequiredForInterestCalculation}
                onChange={(e) => setFormData({ ...formData, balanceRequiredForInterestCalculation: e.target.value })}
              />
            </div>

            {/* Row 4: Enforce Minimum Balance (Col 1), Minimum Balance (Col 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="flex items-center space-x-2 pb-1.5">
                <span className="text-xs text-gray-700">Enforce Minimum Balance</span>
                <input
                  type="checkbox"
                  checked={formData.enforceMinRequiredBalance}
                  onChange={(e) => setFormData({ ...formData, enforceMinRequiredBalance: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>

              <FloatingInput
                label="Minimum Balance"
                type="number"
                value={formData.minRequiredBalance}
                onChange={(e) => setFormData({ ...formData, minRequiredBalance: e.target.value })}
              />
            </div>

            {/* Row 5: Is Withhold Tax Applicable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center space-x-2 pb-1.5">
                <span className="text-xs text-gray-700">Is Withhold Tax Applicable</span>
                <input
                  type="checkbox"
                  checked={formData.isWithholdTaxApplicable}
                  onChange={(e) => setFormData({ ...formData, isWithholdTaxApplicable: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>
              <div />
            </div>

            {/* Divider line matching Image 1 */}
            <div className="w-full h-[1px] bg-gray-200 my-2" />

            {/* Overdraft Section matching Image 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-1 items-center">
              <span className="text-xs font-bold text-gray-900">Overdraft</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-700">Is Overdraft Allowed</span>
                <input
                  type="checkbox"
                  checked={formData.allowOverdraft}
                  onChange={(e) => setFormData({ ...formData, allowOverdraft: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Divider line matching Image 1 */}
            <div className="w-full h-[1px] bg-gray-200 my-2" />

            {/* Dormancy Tracking Section matching Image 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-1 items-center">
              <span className="text-xs font-bold text-gray-900">Dormancy Tracking</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-700">Enable Dormancy Tracking</span>
                <input
                  type="checkbox"
                  checked={formData.enableDormancyTracking}
                  onChange={(e) => setFormData({ ...formData, enableDormancyTracking: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Centered Buttons matching Image 1 */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-casa-settings-next-btn"
                onClick={handleNextStep4}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: CHARGES (Exact match to Image 2)                       */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div id="tour-casa-form-charges" className="space-y-7 pt-2">
            
            {/* Charge dropdown & [+ Add] button matching Image 2 */}
            <div className="flex items-end space-x-3 max-w-lg">
              <div className="flex-1">
                <FloatingSelect
                  label="Charge"
                  value={formData.selectedChargeId}
                  onChange={(e) => setFormData({ ...formData, selectedChargeId: e.target.value })}
                >
                  <option value=""></option>
                  {availableCharges.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                  ))}
                </FloatingSelect>
              </div>

              <button
                type="button"
                disabled={!formData.selectedChargeId}
                onClick={handleAddCharge}
                className={`text-xs font-normal px-4 py-2 rounded-[3px] flex items-center space-x-1 transition-colors ${
                  formData.selectedChargeId 
                    ? 'bg-[#1072ba] hover:bg-[#0e619e] text-white cursor-pointer shadow-2xs' 
                    : 'bg-[#e0e0e0] text-[#9e9e9e] cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Table of added charges if any */}
            {formData.charges.length > 0 && (
              <div className="overflow-x-auto border border-gray-200 rounded-[2px] mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Collected On</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.charges.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2.5 px-3 text-gray-800">{c.name}</td>
                        <td className="py-2.5 px-3 text-gray-600">{c.type}</td>
                        <td className="py-2.5 px-3 text-gray-600">{c.amount.toLocaleString()} VND</td>
                        <td className="py-2.5 px-3 text-gray-600">{c.collectedOn}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              charges: prev.charges.filter(item => item.id !== c.id)
                            }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Centered Buttons matching Image 2 */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-casa-charges-next-btn"
                onClick={handleNextStep5}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: ACCOUNTING (Exact match to Image 5)                    */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 6 && (
          <div id="tour-casa-form-accounting" className="space-y-6 pt-2">
            
            {/* 3 Radio options matching Image 5: None | Cash | Accrual (periodic) */}
            <div className="flex items-center space-x-8 py-2">
              <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer select-none">
                <input
                  type="radio"
                  name="accountingRule"
                  value="None"
                  checked={formData.accountingRule === 'None'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="w-3.5 h-3.5 text-[#28a745] focus:ring-0 cursor-pointer"
                />
                <span>None</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer select-none">
                <input
                  type="radio"
                  name="accountingRule"
                  value="Cash"
                  checked={formData.accountingRule === 'Cash'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="w-3.5 h-3.5 text-[#28a745] focus:ring-0 cursor-pointer"
                />
                <span>Cash</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer select-none">
                <input
                  type="radio"
                  name="accountingRule"
                  value="Accrual (periodic)"
                  checked={formData.accountingRule === 'Accrual (periodic)'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="w-3.5 h-3.5 text-[#28a745] focus:ring-0 cursor-pointer"
                />
                <span>Accrual (periodic)</span>
              </label>
            </div>

            {/* Horizontal divider line matching Image 5 */}
            <div className="w-full h-[1px] bg-gray-200 my-2" />

            {/* When Cash Accounting is selected: 4 sections matching Image 5 */}
            {formData.accountingRule === 'Cash' && (
              <div className="space-y-6 pt-2">
                
                {/* 1. Assets Section matching Image 5 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Assets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingSelect
                      label="Saving reference *"
                      value={formData.savingsReferenceAccountId}
                      onChange={(e) => setFormData({ ...formData, savingsReferenceAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Asset' || g.typeId === '1' || g.typeName === 'Asset').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>

                    <FloatingSelect
                      label="Overdraft portfolio *"
                      value={formData.overdraftPortfolioControlId}
                      onChange={(e) => setFormData({ ...formData, overdraftPortfolioControlId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Asset' || g.typeId === '1' || g.typeName === 'Asset').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>
                  </div>
                </div>

                {/* 2. Liabilities Section matching Image 5 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Liabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingSelect
                      label="Saving control *"
                      value={formData.savingsControlAccountId}
                      onChange={(e) => setFormData({ ...formData, savingsControlAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Liability' || g.typeId === '2' || g.typeName === 'Liability').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>

                    <FloatingSelect
                      label="Savings transfers in suspense *"
                      value={formData.transfersInSuspenseAccountId}
                      onChange={(e) => setFormData({ ...formData, transfersInSuspenseAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Liability' || g.typeId === '2' || g.typeName === 'Liability').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>
                  </div>
                </div>

                {/* 3. Expenses Section matching Image 5 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Expenses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingSelect
                      label="Interest on savings *"
                      value={formData.interestOnSavingsAccountId}
                      onChange={(e) => setFormData({ ...formData, interestOnSavingsAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Expense' || g.typeId === '5' || g.typeName === 'Expense').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>

                    <FloatingSelect
                      label="Write-off *"
                      value={formData.writeOffAccountId}
                      onChange={(e) => setFormData({ ...formData, writeOffAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Expense' || g.typeId === '5' || g.typeName === 'Expense').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>
                  </div>
                </div>

                {/* 4. Income Section matching Image 5 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Income</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingSelect
                      label="Income from fees *"
                      value={formData.incomeFromFeeAccountId}
                      onChange={(e) => setFormData({ ...formData, incomeFromFeeAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Income' || g.typeId === '4' || g.typeName === 'Income').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>

                    <FloatingSelect
                      label="Income from penalties *"
                      value={formData.incomeFromPenaltyAccountId}
                      onChange={(e) => setFormData({ ...formData, incomeFromPenaltyAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Income' || g.typeId === '4' || g.typeName === 'Income').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FloatingSelect
                      label="Overdraft Interest Income *"
                      value={formData.overdraftInterestIncomeAccountId}
                      onChange={(e) => setFormData({ ...formData, overdraftInterestIncomeAccountId: e.target.value })}
                    >
                      <option value=""></option>
                      {glAccounts.filter(g => g.type === 'Income' || g.typeId === '4' || g.typeName === 'Income').map(g => (
                        <option key={g.id} value={g.id}>({g.glCode}) {g.name}</option>
                      ))}
                    </FloatingSelect>
                    <div />
                  </div>
                </div>

                {/* Advanced Accounting Rules Checkbox matching Image 5 */}
                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.advancedAccountingRules}
                      onChange={(e) => setFormData({ ...formData, advancedAccountingRules: e.target.checked })}
                      className="w-3.5 h-3.5 rounded-[2px] border-gray-400 text-[#1072ba] focus:ring-0 cursor-pointer"
                    />
                    <span>Advanced Accounting Rules</span>
                  </label>
                </div>

              </div>
            )}

            {/* Centered Buttons matching Image 5: [ <- Previous ] [ Next -> ] */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>&larr; Previous</span>
              </button>

              <button
                type="button"
                id="tour-casa-accounting-next-btn"
                onClick={handleNextStep6}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <span>Next &rarr;</span>
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: PREVIEW (Exact match to Image 4)                       */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 7 && (
          <div id="tour-casa-preview-card" className="space-y-6 pt-2">
            
            {/* Product Name Title at top matching Image 4 */}
            <div>
              <h2 className="text-base font-normal text-[#212529] pb-2">
                {formData.name || 'TKB Current Account'}
              </h2>
              <div className="w-full h-[1px] bg-gray-200" />
            </div>

            {/* Section 1: Details matching Image 4 */}
            <div className="space-y-2">
              <h4 className="text-xs text-[#1072ba] font-medium">Details</h4>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Short Name:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.shortName || 'TKCA'}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-2" />
            </div>

            {/* Section 2: Currency matching Image 4 */}
            <div className="space-y-2">
              <h4 className="text-xs text-[#1072ba] font-medium">Currency</h4>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Currency:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{currencyDisplayName}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Decimal Places:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.decimalPlaces || '0'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Currency in multiples of:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.currencyMultiplesOf || '1'}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-2" />
            </div>

            {/* Section 3: Terms matching Image 4 */}
            <div className="space-y-2">
              <h4 className="text-xs text-[#1072ba] font-medium">Terms</h4>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Nominal Annual Interest:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.nominalAnnualInterestRate ? `${formData.nominalAnnualInterestRate} %` : '0 %'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Interest Compounding Period:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.interestCompoundingPeriodType || 'Daily'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Interest Posting Period:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.interestPostingPeriodType || 'Monthly'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Interest Calculated using:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.interestCalculationType || 'Daily Balance'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Days in Year:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.interestCalculationDaysInYearType || '365 Days'}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-2" />
            </div>

            {/* Section 4: Settings matching Image 4 */}
            <div className="space-y-2">
              <h4 className="text-xs text-[#1072ba] font-medium">Settings</h4>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Apply Withdrawal Fee for Transfers:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.withdrawalFeeForTransfers ? 'Yes' : 'No'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Enforce Minimum Balance:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.enforceMinRequiredBalance ? 'Yes' : 'No'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Withhold Tax is Applicable:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.isWithholdTaxApplicable ? 'Yes' : 'No'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Is Overdraft Allowed:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.allowOverdraft ? 'Yes' : 'No'}</span>
              </div>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Enable Dormancy Tracking:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.enableDormancyTracking ? 'Yes' : 'No'}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-2" />
            </div>

            {/* Section 5: Accounting matching Image 4 */}
            <div className="space-y-2">
              <h4 className="text-xs text-[#1072ba] font-medium">Accounting</h4>
              <div className="grid grid-cols-12 text-xs py-1">
                <span className="col-span-4 md:col-span-3 text-gray-700">Type:</span>
                <span className="col-span-8 md:col-span-9 font-normal text-[#212529]">{formData.accountingRule || 'None'}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-2" />
            </div>

            {/* Action Buttons for Step 7 matching Image 4: [ <- Previous ] [ Cancel ] [ Submit ] */}
            <div className="flex items-center justify-center space-x-3 pt-8 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
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
                id="tour-casa-submit-btn"
                onClick={handleFinalSubmit}
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
