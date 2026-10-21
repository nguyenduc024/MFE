import React, { useState, useEffect } from 'react';
import { Pencil, Check, Calendar, ChevronDown, X, Info, Eye } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style matching screenshot)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
  className = '',
  id = undefined
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
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-4 pt-0.5 disabled:text-gray-400"
      />
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
  className = '',
  id = undefined
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

export default function CreateLoanProductView({
  onNavigateHome,
  onNavigateProducts,
  onNavigateLoanProducts,
  onSaveProduct
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: DETAILS, 2: CURRENCY, 3: SETTINGS, 4: TERMS, 5: CHARGES, 6: ACCOUNTING, 7: PREVIEW

  const steps = [
    { id: 1, label: 'DETAILS' },
    { id: 2, label: 'CURRENCY' },
    { id: 3, label: 'SETTINGS' },
    { id: 4, label: 'TERMS' },
    { id: 5, label: 'CHARGES' },
    { id: 6, label: 'ACCOUNTING' },
    { id: 7, label: 'PREVIEW' }
  ];

  // Initial Form State is completely empty matching user requirement: "không điền trước dữ liệu"
  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 1)
    name: '',
    shortName: '',
    externalId: '',
    fund: '',
    includeInLoanCounter: false,
    startDate: '',
    closeDate: '',
    description: '',

    // Step 2: CURRENCY (Image 2)
    currency: '',
    decimalPlaces: '',
    currencyMultiplesOf: '',
    installmentMultiplesOf: '',

    // Step 3: SETTINGS (Images 3 & 4)
    amortization: '',
    interestMethod: '',
    interestCalculationPeriod: '',
    isEqualAmortization: false,
    loanScheduleType: '',
    repaymentStrategy: '',
    enableMultipleDisbursals: false,
    enableDownPayment: false,
    graceOnPrincipalPayment: '',
    graceOnInterestPayment: '',
    delinquencyBucket: '',
    interestFreePeriod: '',
    arrearsTolerance: '',
    daysInYear: '',
    daysInMonth: '',
    allowFixingInstallment: false,

    // Settings Lower Part (Image 4)
    overdueDaysForArrears: '',
    overdueDaysForNPA: '',
    accountMovesOutOfNpa: false,
    principalThresholdForLastInstalment: '',
    variableInstallmentsAllowed: false,
    allowedForTopUpLoans: false,
    recalculateInterest: false,
    placeGuaranteeFundsOnHold: false,
    useGlobalConfigForRepaymentEvent: false,
    dueDaysForRepaymentEvent: '',
    overdueDaysForRepaymentEvent: '',
    allowOverridingSelectTerms: false,
    overrideAmortization: false,
    overrideInterestMethod: false,
    overrideRepaymentStrategy: false,
    overrideInterestCalculationPeriod: false,
    overrideArrearsTolerance: false,
    overrideRepaidEvery: false,
    overrideMoratorium: false,
    overrideOverdueDaysForArrears: false,

    // Step 4: TERMS (Image 5)
    minPrincipal: '',
    defaultPrincipal: '',
    maxPrincipal: '',
    allowDisbursalAboveApplied: false,
    installmentDayCalculationFrom: '',
    minRepayments: '',
    defaultRepayments: '',
    maxRepayments: '',
    isInterestRecognitionOnDisbursementDate: false,
    isZeroInterestRate: false,
    isLinkedToFloatingInterestRates: false,
    minInterestRate: '',
    defaultInterestRate: '',
    maxInterestRate: '',
    interestRateFrequency: '',
    termsVaryBasedOnLoanCycle: false,
    repaidEveryFrequency: '',
    repaidEveryFrequencyType: '',
    minDaysBetweenDisbursalAndFirstRepayment: '',

    // Step 5: CHARGES
    charges: [],

    // Step 6: ACCOUNTING
    accountingRule: 'None',
    fundSourceAccountId: '',
    loanPortfolioAccountId: '',
    transferInSuspenseAccountId: '',
    interestIncomeAccountId: '',
    feeIncomeAccountId: '',
    penaltyIncomeAccountId: '',
    recoveryIncomeAccountId: '',
    chargeOffInterestAccountId: '',
    chargeOffFeeAccountId: '',
    chargeOffPenaltyAccountId: '',
    goodwillInterestAccountId: '',
    goodwillFeeAccountId: '',
    goodwillPenaltyAccountId: '',
    lossesWrittenOffAccountId: '',
    goodwillExpenseAccountId: '',
    chargeOffExpenseAccountId: '',
    chargeOffFraudExpenseAccountId: '',
    overpaymentLiabilityAccountId: '',
    advancedAccountingRules: false
  });

  // Event listeners for practice guide / autofill helpers
  useEffect(() => {
    const handleFillDetails = () => {
      setFormData(prev => ({
        ...prev,
        name: 'TKB Personal Loan',
        shortName: 'TKPL',
        externalId: 'TKB-PRD-PL-001',
        fund: '',
        includeInLoanCounter: false,
        startDate: '10/13/2026',
        closeDate: '',
        description: 'Personal installment loan with monthly repayments and declining balance interest calculation.'
      }));
    };

    const handleFillCurrency = () => {
      setFormData(prev => ({
        ...prev,
        currency: 'Vietnamese Dong',
        decimalPlaces: '0',
        currencyMultiplesOf: '1',
        installmentMultiplesOf: '1'
      }));
    };

    const handleFillSettingsPart1 = () => {
      setFormData(prev => ({
        ...prev,
        amortization: 'Equal installments',
        interestMethod: 'Declining Balance',
        interestCalculationPeriod: 'Daily',
        isEqualAmortization: false,
        loanScheduleType: 'Cumulative',
        repaymentStrategy: 'Interest, Principal, Penalties, Fees Order',
        enableMultipleDisbursals: false,
        enableDownPayment: false,
        graceOnPrincipalPayment: '',
        graceOnInterestPayment: '',
        delinquencyBucket: '',
        interestFreePeriod: '',
        arrearsTolerance: '0',
        daysInYear: '365 Days',
        daysInMonth: 'Actual',
        allowFixingInstallment: false
      }));
    };

    const handleFillSettingsPart2 = () => {
      setFormData(prev => ({
        ...prev,
        overdueDaysForArrears: '',
        overdueDaysForNPA: '90',
        accountMovesOutOfNpa: true,
        principalThresholdForLastInstalment: '',
        variableInstallmentsAllowed: false,
        allowedForTopUpLoans: false,
        recalculateInterest: false,
        placeGuaranteeFundsOnHold: false,
        useGlobalConfigForRepaymentEvent: false,
        dueDaysForRepaymentEvent: '1',
        overdueDaysForRepaymentEvent: '1',
        allowOverridingSelectTerms: true,
        overrideAmortization: true,
        overrideInterestMethod: true,
        overrideRepaymentStrategy: true,
        overrideInterestCalculationPeriod: true,
        overrideArrearsTolerance: true,
        overrideRepaidEvery: true,
        overrideMoratorium: true,
        overrideOverdueDaysForArrears: true
      }));
    };

    const handleFillTerms = () => {
      setFormData(prev => ({
        ...prev,
        minPrincipal: '5000000',
        defaultPrincipal: '10000000',
        maxPrincipal: '50000000',
        allowDisbursalAboveApplied: false,
        installmentDayCalculationFrom: 'Disbursement Date',
        minRepayments: '6',
        defaultRepayments: '12',
        maxRepayments: '24',
        isInterestRecognitionOnDisbursementDate: false,
        isZeroInterestRate: false,
        isLinkedToFloatingInterestRates: false,
        minInterestRate: '10',
        defaultInterestRate: '12',
        maxInterestRate: '16',
        interestRateFrequency: 'Per year',
        termsVaryBasedOnLoanCycle: false,
        repaidEveryFrequency: '1',
        repaidEveryFrequencyType: 'Months',
        minDaysBetweenDisbursalAndFirstRepayment: ''
      }));
    };

    const handleFillAccounting = () => {
      setFormData(prev => ({
        ...prev,
        accountingRule: 'Cash',
        fundSourceAccountId: '110201',
        loanPortfolioAccountId: '120101',
        transferInSuspenseAccountId: '130101',
        interestIncomeAccountId: '410101',
        feeIncomeAccountId: '420109',
        penaltyIncomeAccountId: '420103',
        recoveryIncomeAccountId: '420110',
        chargeOffInterestAccountId: '410101',
        chargeOffFeeAccountId: '420109',
        chargeOffPenaltyAccountId: '420103',
        goodwillInterestAccountId: '410101',
        goodwillFeeAccountId: '420109',
        goodwillPenaltyAccountId: '420103',
        lossesWrittenOffAccountId: '520101',
        goodwillExpenseAccountId: '520104',
        chargeOffExpenseAccountId: '520105',
        chargeOffFraudExpenseAccountId: '520106',
        overpaymentLiabilityAccountId: '220202',
        advancedAccountingRules: false
      }));
    };

    const handleFillAll = () => {
      handleFillDetails();
      handleFillCurrency();
      handleFillSettingsPart1();
      handleFillSettingsPart2();
      handleFillTerms();
      handleFillAccounting();
    };

    const handleSetStep = (e) => {
      if (e?.detail?.step) {
        setCurrentStep(e.detail.step);
      }
    };

    window.addEventListener('practice-fill-loan-details', handleFillDetails);
    window.addEventListener('practice-fill-loan-currency', handleFillCurrency);
    window.addEventListener('practice-fill-loan-settings-part1', handleFillSettingsPart1);
    window.addEventListener('practice-fill-loan-settings-part2', handleFillSettingsPart2);
    window.addEventListener('practice-fill-loan-terms', handleFillTerms);
    window.addEventListener('practice-fill-loan-accounting', handleFillAccounting);
    window.addEventListener('practice-fill-loan-all', handleFillAll);
    window.addEventListener('practice-set-loan-step', handleSetStep);

    return () => {
      window.removeEventListener('practice-fill-loan-details', handleFillDetails);
      window.removeEventListener('practice-fill-loan-currency', handleFillCurrency);
      window.removeEventListener('practice-fill-loan-settings-part1', handleFillSettingsPart1);
      window.removeEventListener('practice-fill-loan-settings-part2', handleFillSettingsPart2);
      window.removeEventListener('practice-fill-loan-terms', handleFillTerms);
      window.removeEventListener('practice-fill-loan-accounting', handleFillAccounting);
      window.removeEventListener('practice-fill-loan-all', handleFillAll);
      window.removeEventListener('practice-set-loan-step', handleSetStep);
    };
  }, []);

  // Broadcast current form data changes to tour
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('loan-form-changed', {
      detail: { formData, currentStep }
    }));
  }, [formData, currentStep]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const createdProduct = {
      id: String(Date.now()),
      name: formData.name || 'TKB Personal Loan',
      shortName: formData.shortName || 'TKPL',
      externalId: formData.externalId || 'TKB-PRD-PL-001',
      description: formData.description || 'Personal installment loan with monthly repayments and declining balance interest calculation.',
      currencyCode: 'VND',
      currencyName: formData.currency || 'Vietnamese Dong',
      principal: Number(formData.defaultPrincipal) || 10000000,
      minPrincipal: Number(formData.minPrincipal) || 5000000,
      maxPrincipal: Number(formData.maxPrincipal) || 50000000,
      numberOfRepayments: Number(formData.defaultRepayments) || 12,
      minRepayments: Number(formData.minRepayments) || 6,
      maxRepayments: Number(formData.maxRepayments) || 24,
      repaymentFrequency: `${formData.repaidEveryFrequency || '1'} ${formData.repaidEveryFrequencyType || 'Months'}`,
      annualInterestRate: Number(formData.defaultInterestRate) || 12.0,
      minInterestRate: Number(formData.minInterestRate) || 10.0,
      maxInterestRate: Number(formData.maxInterestRate) || 16.0,
      interestMethod: formData.interestMethod || 'Declining Balance',
      amortization: formData.amortization || 'Equal installments',
      accountingRule: formData.accountingRule || 'Cash',
      status: 'Active',
      expiryDate: formData.closeDate || ''
    };

    if (onSaveProduct) {
      onSaveProduct(createdProduct);
    }
    if (onNavigateLoanProducts) {
      onNavigateLoanProducts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1: Create | Home / Products / Loan Products / Create */}
      <div className="flex items-center space-x-2.5 mb-5">
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
            onClick={onNavigateLoanProducts} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Loan Products
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header matching Images 1-5 */}
        <div id="tour-loan-stepper" className="relative flex items-center justify-between px-2 pt-1 pb-4">
          <div className="absolute left-6 right-6 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {steps.map((st) => {
            const isCompleted = st.id < currentStep;
            const isCurrent = st.id === currentStep;

            return (
              <div 
                key={st.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => setCurrentStep(st.id)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-[#28a745] text-white shadow-2xs' 
                    : isCurrent 
                    ? 'bg-[#1072ba] text-white shadow-2xs' 
                    : 'bg-white border-2 border-gray-400 text-gray-500 group-hover:border-gray-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : st.id === 7 ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <Pencil className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className={`text-[11px] font-semibold mt-2 tracking-wide uppercase transition-colors ${
                  isCurrent ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab 1: DETAILS (Image 1) */}
        {currentStep === 1 && (
          <form id="tour-loan-details-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="space-y-5">
              <div className="w-full">
                <FloatingInput
                  id="tour-loan-input-name"
                  label="Product Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: TKB Personal Loan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-shortname"
                  label="Short Name *"
                  required
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="VD: Loan"
                />
                <FloatingInput
                  id="tour-loan-input-externalid"
                  label="External Id"
                  value={formData.externalId}
                  onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                  placeholder="VD: TKB-PRD-PL-001"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 items-center">
                <FloatingSelect
                  label="Fund"
                  value={formData.fund}
                  onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="General Fund">General Fund</option>
                  <option value="Retail Loan Fund">Retail Loan Fund</option>
                </FloatingSelect>

                <div className="flex items-center space-x-2 pt-2">
                  <span className="text-xs text-gray-600">Include in Customer Loan Counter</span>
                  <input
                    type="checkbox"
                    checked={formData.includeInLoanCounter}
                    onChange={(e) => setFormData({ ...formData, includeInLoanCounter: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <div className="relative">
                  <FloatingInput
                    id="tour-loan-input-startdate"
                    label="Start Date"
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="10/13/2026"
                  />
                  <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <FloatingInput
                    label="Close Date"
                    type="text"
                    value={formData.closeDate}
                    onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                    placeholder=""
                  />
                  <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
                </div>
              </div>

              <div className="w-full">
                <FloatingInput
                  id="tour-loan-input-description"
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Personal installment loan with monthly repayments and declining balance interest calculation."
                />
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                disabled
                className="bg-gray-200 text-gray-400 text-xs font-semibold px-5 py-2 rounded-[2px] cursor-not-allowed select-none"
              >
                Previous
              </button>
              <button
                type="submit"
                id="tour-loan-details-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: CURRENCY (Image 2) */}
        {currentStep === 2 && (
          <form id="tour-loan-currency-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingSelect
                  id="tour-loan-select-currency"
                  label="Currency *"
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Vietnamese Dong">Vietnamese Dong</option>
                  <option value="US Dollar">US Dollar</option>
                  <option value="Euro">Euro</option>
                </FloatingSelect>

                <FloatingInput
                  id="tour-loan-input-decimals"
                  label="Decimal Places *"
                  required
                  type="number"
                  value={formData.decimalPlaces}
                  onChange={(e) => setFormData({ ...formData, decimalPlaces: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-multiples"
                  label="Currency in multiples of"
                  type="number"
                  value={formData.currencyMultiplesOf}
                  onChange={(e) => setFormData({ ...formData, currencyMultiplesOf: e.target.value })}
                  placeholder="1"
                />
                <FloatingInput
                  id="tour-loan-input-installment-multiples"
                  label="Installment in multiples of"
                  type="number"
                  value={formData.installmentMultiplesOf}
                  onChange={(e) => setFormData({ ...formData, installmentMultiplesOf: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-currency-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: SETTINGS (Images 3 & 4) */}
        {currentStep === 3 && (
          <form id="tour-loan-settings-form" onSubmit={handleNext} className="space-y-8 pt-2">
            {/* Part 1 (Upper Portion - Image 3) */}
            <div id="tour-loan-settings-part1" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <FloatingSelect
                  id="tour-loan-select-amortization"
                  label="Amortization *"
                  required
                  value={formData.amortization}
                  onChange={(e) => setFormData({ ...formData, amortization: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Equal installments">Equal installments</option>
                  <option value="Equal principal payments">Equal principal payments</option>
                </FloatingSelect>

                <FloatingSelect
                  id="tour-loan-select-interestmethod"
                  label="Interest Method *"
                  required
                  value={formData.interestMethod}
                  onChange={(e) => setFormData({ ...formData, interestMethod: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Declining Balance">Declining Balance</option>
                  <option value="Flat">Flat</option>
                </FloatingSelect>

                <FloatingSelect
                  id="tour-loan-select-interestcalcperiod"
                  label="Interest calculation period *"
                  required
                  value={formData.interestCalculationPeriod}
                  onChange={(e) => setFormData({ ...formData, interestCalculationPeriod: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Daily">Daily</option>
                  <option value="Same as repayment period">Same as repayment period</option>
                </FloatingSelect>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs text-gray-600">Is Equal Amortization?</span>
                <input
                  type="checkbox"
                  checked={formData.isEqualAmortization}
                  onChange={(e) => setFormData({ ...formData, isEqualAmortization: e.target.checked })}
                  className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Loan Schedule */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-gray-800">Loan Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  <FloatingSelect
                    id="tour-loan-select-scheduletype"
                    label="Loan Schedule Type *"
                    required
                    value={formData.loanScheduleType}
                    onChange={(e) => setFormData({ ...formData, loanScheduleType: e.target.value })}
                  >
                    <option value=""> </option>
                    <option value="Cumulative">Cumulative</option>
                  </FloatingSelect>

                  <FloatingSelect
                    id="tour-loan-select-repaymentstrategy"
                    label="Repayment strategy *"
                    required
                    value={formData.repaymentStrategy}
                    onChange={(e) => setFormData({ ...formData, repaymentStrategy: e.target.value })}
                  >
                    <option value=""> </option>
                    <option value="Interest, Principal, Penalties, Fees Order">Interest, Principal, Penalties, Fees Order</option>
                    <option value="Mifos style">Mifos style</option>
                    <option value="HeavensFamily">HeavensFamily</option>
                  </FloatingSelect>
                </div>
              </div>

              {/* Loan Tranche Details & Down Payment */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-gray-800">Loan Tranche Details</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Enable Multiple Disbursals</span>
                  <input
                    type="checkbox"
                    checked={formData.enableMultipleDisbursals}
                    onChange={(e) => setFormData({ ...formData, enableMultipleDisbursals: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-gray-800">Down Payment</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Enable Down Payment</span>
                  <input
                    type="checkbox"
                    checked={formData.enableDownPayment}
                    onChange={(e) => setFormData({ ...formData, enableDownPayment: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Moratorium ? */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-gray-800">Moratorium ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  <FloatingInput
                    label="Grace on principal payment"
                    value={formData.graceOnPrincipalPayment}
                    onChange={(e) => setFormData({ ...formData, graceOnPrincipalPayment: e.target.value })}
                  />
                  <FloatingInput
                    label="Grace on interest payment"
                    value={formData.graceOnInterestPayment}
                    onChange={(e) => setFormData({ ...formData, graceOnInterestPayment: e.target.value })}
                  />
                </div>
              </div>

              {/* Delinquency Bucket */}
              <div className="pt-1">
                <div className="relative pt-3.5 pb-1 border-b border-gray-300 max-w-sm">
                  <label className="absolute left-0 -top-1 text-[11px] text-gray-500">
                    Delinquency Bucket
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">{formData.delinquencyBucket || ''}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, delinquencyBucket: '' })}
                      className="text-gray-400 hover:text-gray-600 text-xs px-1"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 pt-1">
                <FloatingInput
                  label="Interest free period"
                  value={formData.interestFreePeriod}
                  onChange={(e) => setFormData({ ...formData, interestFreePeriod: e.target.value })}
                />
                <FloatingInput
                  id="tour-loan-input-arrearstolerance"
                  label="Arrears tolerance"
                  value={formData.arrearsTolerance}
                  onChange={(e) => setFormData({ ...formData, arrearsTolerance: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingSelect
                  id="tour-loan-select-daysinyear"
                  label="Days in year *"
                  required
                  value={formData.daysInYear}
                  onChange={(e) => setFormData({ ...formData, daysInYear: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="365 Days">365 Days</option>
                  <option value="360 Days">360 Days</option>
                  <option value="Actual">Actual</option>
                </FloatingSelect>

                <FloatingSelect
                  id="tour-loan-select-daysinmonth"
                  label="Days in month *"
                  required
                  value={formData.daysInMonth}
                  onChange={(e) => setFormData({ ...formData, daysInMonth: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Actual">Actual</option>
                  <option value="30 Days">30 Days</option>
                </FloatingSelect>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs text-gray-600">Allow fixing of the installment amount</span>
                <input
                  type="checkbox"
                  checked={formData.allowFixingInstallment}
                  onChange={(e) => setFormData({ ...formData, allowFixingInstallment: e.target.checked })}
                  className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Part 2 (Lower Portion - Image 4) */}
            <div id="tour-loan-settings-part2" className="space-y-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingInput
                  label="Number of days a loan may be overdue before moving into arrears ?"
                  value={formData.overdueDaysForArrears}
                  onChange={(e) => setFormData({ ...formData, overdueDaysForArrears: e.target.value })}
                  placeholder="On arrears ageing"
                />
                <FloatingInput
                  id="tour-loan-input-npadays"
                  label="Maximum number of days a loan may be overdue before becoming a NPA (non performing asset) ?"
                  value={formData.overdueDaysForNPA}
                  onChange={(e) => setFormData({ ...formData, overdueDaysForNPA: e.target.value })}
                  placeholder="90"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700 font-medium">Account moves out of NPA only after all arrears have been cleared</span>
                  <input
                    id="tour-loan-checkbox-npa"
                    type="checkbox"
                    checked={formData.accountMovesOutOfNpa}
                    onChange={(e) => setFormData({ ...formData, accountMovesOutOfNpa: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
                <FloatingInput
                  label="Principal Threshold (%) for Last Instalment"
                  value={formData.principalThresholdForLastInstalment}
                  onChange={(e) => setFormData({ ...formData, principalThresholdForLastInstalment: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Are Variable Installments allowed?</span>
                  <input
                    type="checkbox"
                    checked={formData.variableInstallmentsAllowed}
                    onChange={(e) => setFormData({ ...formData, variableInstallmentsAllowed: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Allowed to be used for providing Top Up Loans</span>
                  <input
                    type="checkbox"
                    checked={formData.allowedForTopUpLoans}
                    onChange={(e) => setFormData({ ...formData, allowedForTopUpLoans: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Interest Recalculation */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-gray-800">Interest Recalculation</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Recalculate Interest</span>
                  <input
                    type="checkbox"
                    checked={formData.recalculateInterest}
                    onChange={(e) => setFormData({ ...formData, recalculateInterest: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Guarantee Requirements */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-gray-800">Guarantee Requirements</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Place Guarantee Funds On-Hold</span>
                  <input
                    type="checkbox"
                    checked={formData.placeGuaranteeFundsOnHold}
                    onChange={(e) => setFormData({ ...formData, placeGuaranteeFundsOnHold: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event Settings? */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-gray-800">Event Settings?</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-gray-600">Use the Global Configurations values to the Repayment Event (notifications)</span>
                  <input
                    type="checkbox"
                    checked={formData.useGlobalConfigForRepaymentEvent}
                    onChange={(e) => setFormData({ ...formData, useGlobalConfigForRepaymentEvent: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  <FloatingInput
                    label="Due days for repayment event"
                    value={formData.dueDaysForRepaymentEvent}
                    onChange={(e) => setFormData({ ...formData, dueDaysForRepaymentEvent: e.target.value })}
                    placeholder="1"
                  />
                  <FloatingInput
                    label="OverDue days for repayment event"
                    value={formData.overdueDaysForRepaymentEvent}
                    onChange={(e) => setFormData({ ...formData, overdueDaysForRepaymentEvent: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Configurable Terms and Settings */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-800">Configurable Terms and Settings:</span>
                  <span className="text-xs text-gray-700">Allow overriding select terms and settings in loan accounts</span>
                  <input
                    id="tour-loan-checkbox-override"
                    type="checkbox"
                    checked={formData.allowOverridingSelectTerms}
                    onChange={(e) => setFormData({ ...formData, allowOverridingSelectTerms: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-gray-300 focus:ring-0 cursor-pointer ml-1"
                  />
                </div>

                {formData.allowOverridingSelectTerms && (
                  <div id="tour-loan-override-options" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 pt-2 pl-4">
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Amortization</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideAmortization}
                        onChange={(e) => setFormData({ ...formData, overrideAmortization: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Interest method</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideInterestMethod}
                        onChange={(e) => setFormData({ ...formData, overrideInterestMethod: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Repayment strategy</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideRepaymentStrategy}
                        onChange={(e) => setFormData({ ...formData, overrideRepaymentStrategy: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Interest calculation period</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideInterestCalculationPeriod}
                        onChange={(e) => setFormData({ ...formData, overrideInterestCalculationPeriod: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Arrears tolerance</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideArrearsTolerance}
                        onChange={(e) => setFormData({ ...formData, overrideArrearsTolerance: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Repaid every</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideRepaidEvery}
                        onChange={(e) => setFormData({ ...formData, overrideRepaidEvery: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Moratorium</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideMoratorium}
                        onChange={(e) => setFormData({ ...formData, overrideMoratorium: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-xs">
                      <span className="text-xs text-gray-700">Number of days a loan may be overdue before moving into arrears</span>
                      <input
                        type="checkbox"
                        checked={formData.overrideOverdueDaysForArrears}
                        onChange={(e) => setFormData({ ...formData, overrideOverdueDaysForArrears: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-settings-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: TERMS (Image 5) */}
        {currentStep === 4 && (
          <form id="tour-loan-terms-form" onSubmit={handleNext} className="space-y-6 pt-2">
            {/* Principal ? */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-800">Principal ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-minprincipal"
                  label="Minimum"
                  type="number"
                  value={formData.minPrincipal}
                  onChange={(e) => setFormData({ ...formData, minPrincipal: e.target.value })}
                  placeholder="5000000"
                />
                <FloatingInput
                  id="tour-loan-input-defaultprincipal"
                  label="Default *"
                  required
                  type="number"
                  value={formData.defaultPrincipal}
                  onChange={(e) => setFormData({ ...formData, defaultPrincipal: e.target.value })}
                  placeholder="10000000"
                />
                <FloatingInput
                  id="tour-loan-input-maxprincipal"
                  label="Maximum"
                  type="number"
                  value={formData.maxPrincipal}
                  onChange={(e) => setFormData({ ...formData, maxPrincipal: e.target.value })}
                  placeholder="50000000"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <span className="text-xs text-gray-600">Allow approval / disbursal above loan applied amount</span>
                <input
                  type="checkbox"
                  checked={formData.allowDisbursalAboveApplied}
                  onChange={(e) => setFormData({ ...formData, allowDisbursalAboveApplied: e.target.checked })}
                  className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="w-full md:w-1/2 pt-2">
                <FloatingSelect
                  id="tour-loan-select-installmentdaycalc"
                  label="Installment day calculation from ? *"
                  required
                  value={formData.installmentDayCalculationFrom}
                  onChange={(e) => setFormData({ ...formData, installmentDayCalculationFrom: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Disbursement Date">Disbursement Date</option>
                  <option value="Due Date">Due Date</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Number of repayments ? */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800">Number of repayments ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-minrepayments"
                  label="Minimum"
                  type="number"
                  value={formData.minRepayments}
                  onChange={(e) => setFormData({ ...formData, minRepayments: e.target.value })}
                  placeholder="6"
                />
                <FloatingInput
                  id="tour-loan-input-defaultrepayments"
                  label="Default *"
                  required
                  type="number"
                  value={formData.defaultRepayments}
                  onChange={(e) => setFormData({ ...formData, defaultRepayments: e.target.value })}
                  placeholder="12"
                />
                <FloatingInput
                  id="tour-loan-input-maxrepayments"
                  label="Maximum"
                  type="number"
                  value={formData.maxRepayments}
                  onChange={(e) => setFormData({ ...formData, maxRepayments: e.target.value })}
                  placeholder="24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Is interest recognition on disbursement date?</span>
                  <input
                    type="checkbox"
                    checked={formData.isInterestRecognitionOnDisbursementDate}
                    onChange={(e) => setFormData({ ...formData, isInterestRecognitionOnDisbursementDate: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Is Zero Interest Rate?</span>
                  <input
                    type="checkbox"
                    checked={formData.isZeroInterestRate}
                    onChange={(e) => setFormData({ ...formData, isZeroInterestRate: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Is Linked to floating interest rates?</span>
                  <input
                    type="checkbox"
                    checked={formData.isLinkedToFloatingInterestRates}
                    onChange={(e) => setFormData({ ...formData, isLinkedToFloatingInterestRates: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Interest Rates & Nominal interest rate ? */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800">Interest Rates</h3>
              <h4 className="text-[11px] font-medium text-gray-600">Nominal interest rate ?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-minrate"
                  label="Minimum"
                  type="number"
                  step="0.1"
                  value={formData.minInterestRate}
                  onChange={(e) => setFormData({ ...formData, minInterestRate: e.target.value })}
                  placeholder="10"
                />
                <FloatingInput
                  id="tour-loan-input-defaultrate"
                  label="Default *"
                  required
                  type="number"
                  step="0.1"
                  value={formData.defaultInterestRate}
                  onChange={(e) => setFormData({ ...formData, defaultInterestRate: e.target.value })}
                  placeholder="12"
                />
                <FloatingInput
                  id="tour-loan-input-maxrate"
                  label="Maximum"
                  type="number"
                  step="0.1"
                  value={formData.maxInterestRate}
                  onChange={(e) => setFormData({ ...formData, maxInterestRate: e.target.value })}
                  placeholder="16"
                />
                <FloatingSelect
                  id="tour-loan-select-ratefrequency"
                  label="Frequency *"
                  required
                  value={formData.interestRateFrequency}
                  onChange={(e) => setFormData({ ...formData, interestRateFrequency: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Per year">Per year</option>
                  <option value="Per month">Per month</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Variations */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold text-gray-800">Variations</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Terms vary based on loan cycle</span>
                <input
                  type="checkbox"
                  checked={formData.termsVaryBasedOnLoanCycle}
                  onChange={(e) => setFormData({ ...formData, termsVaryBasedOnLoanCycle: e.target.checked })}
                  className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Repaid every ? */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800">Repaid every ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingInput
                  id="tour-loan-input-repaidfrequency"
                  label="Frequency *"
                  required
                  type="number"
                  value={formData.repaidEveryFrequency}
                  onChange={(e) => setFormData({ ...formData, repaidEveryFrequency: e.target.value })}
                  placeholder="1"
                />
                <FloatingSelect
                  id="tour-loan-select-repaidfrequencytype"
                  label="Frequency Type *"
                  required
                  value={formData.repaidEveryFrequencyType}
                  onChange={(e) => setFormData({ ...formData, repaidEveryFrequencyType: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                </FloatingSelect>
              </div>

              <div className="w-full md:w-1/2 pt-2">
                <FloatingInput
                  label="Minimum days between disbursal and first repayment date"
                  value={formData.minDaysBetweenDisbursalAndFirstRepayment}
                  onChange={(e) => setFormData({ ...formData, minDaysBetweenDisbursalAndFirstRepayment: e.target.value })}
                />
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-terms-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: CHARGES */}
        {currentStep === 5 && (
          <form id="tour-loan-charges-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="bg-gray-50 p-6 rounded-[2px] border border-gray-200 text-center space-y-2">
              <div className="text-xs font-semibold text-gray-700">Charges (Biểu Phí)</div>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Gói vay tiêu dùng tín chấp TKB Personal Loan không áp dụng phí khởi tạo hay phí duy trì định kỳ. Bạn có thể nhấn Next để chuyển sang cấu hình kế toán sổ cái.
              </p>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-charges-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: ACCOUNTING */}
        {currentStep === 6 && (
          <form id="tour-loan-accounting-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="space-y-5">
              <div className="flex items-center space-x-6 text-xs text-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountingRule"
                    value="None"
                    checked={formData.accountingRule === 'None'}
                    onChange={() => setFormData({ ...formData, accountingRule: 'None' })}
                    className="text-[#1072ba]"
                  />
                  <span>None</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountingRule"
                    value="Cash"
                    checked={formData.accountingRule === 'Cash'}
                    onChange={() => setFormData({ ...formData, accountingRule: 'Cash' })}
                    className="text-[#1072ba]"
                  />
                  <span>Cash</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountingRule"
                    value="Accrual (Periodic)"
                    checked={formData.accountingRule === 'Accrual (Periodic)'}
                    onChange={() => setFormData({ ...formData, accountingRule: 'Accrual (Periodic)' })}
                    className="text-[#1072ba]"
                  />
                  <span>Accrual (Periodic)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountingRule"
                    value="Accrual (Upfront)"
                    checked={formData.accountingRule === 'Accrual (Upfront)'}
                    onChange={() => setFormData({ ...formData, accountingRule: 'Accrual (Upfront)' })}
                    className="text-[#1072ba]"
                  />
                  <span>Accrual (Upfront)</span>
                </label>
              </div>

              {formData.accountingRule === 'Cash' && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  {/* 1. Assets */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#1072ba] uppercase tracking-wide">
                      Assets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      <FloatingSelect
                        id="tour-loan-acc-fundsource"
                        label="Fund source *"
                        required
                        value={formData.fundSourceAccountId}
                        onChange={(e) => setFormData({ ...formData, fundSourceAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="110201">(110201) Settlement Bank Account</option>
                        <option value="110101">(110101) Cash at Vault</option>
                        <option value="110102">(110102) Cash at Teller</option>
                      </FloatingSelect>

                      <FloatingSelect
                        id="tour-loan-acc-loanportfolio"
                        label="Loan portfolio *"
                        required
                        value={formData.loanPortfolioAccountId}
                        onChange={(e) => setFormData({ ...formData, loanPortfolioAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="120101">(120101) Retail Loan Principal</option>
                      </FloatingSelect>

                      <FloatingSelect
                        id="tour-loan-acc-transfersuspense"
                        label="Transfer in suspense *"
                        required
                        value={formData.transferInSuspenseAccountId}
                        onChange={(e) => setFormData({ ...formData, transferInSuspenseAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="130101">(130101) Clearing Receivable</option>
                      </FloatingSelect>
                    </div>
                  </div>

                  {/* 2. Income */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-[#1072ba] uppercase tracking-wide">
                      Income
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      <FloatingSelect
                        id="tour-loan-acc-interestincome"
                        label="Income from interest *"
                        required
                        value={formData.interestIncomeAccountId}
                        onChange={(e) => setFormData({ ...formData, interestIncomeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="410101">(410101) Loan Interest Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        id="tour-loan-acc-feeincome"
                        label="Income from fees *"
                        required
                        value={formData.feeIncomeAccountId}
                        onChange={(e) => setFormData({ ...formData, feeIncomeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420109">(420109) Loan Fee Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        id="tour-loan-acc-penaltyincome"
                        label="Income from penalties *"
                        required
                        value={formData.penaltyIncomeAccountId}
                        onChange={(e) => setFormData({ ...formData, penaltyIncomeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420103">(420103) Loan Penalty Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        id="tour-loan-acc-recoveryincome"
                        label="Income from Recovery Repayments *"
                        required
                        value={formData.recoveryIncomeAccountId}
                        onChange={(e) => setFormData({ ...formData, recoveryIncomeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420110">(420110) Loan Recovery Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from ChargeOff Interest"
                        value={formData.chargeOffInterestAccountId}
                        onChange={(e) => setFormData({ ...formData, chargeOffInterestAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="410101">(410101) Loan Interest Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from ChargeOff Fees"
                        value={formData.chargeOffFeeAccountId}
                        onChange={(e) => setFormData({ ...formData, chargeOffFeeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420109">(420109) Loan Fee Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from ChargeOff Penalty"
                        value={formData.chargeOffPenaltyAccountId}
                        onChange={(e) => setFormData({ ...formData, chargeOffPenaltyAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420103">(420103) Loan Penalty Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from Goodwill Credit Interest"
                        value={formData.goodwillInterestAccountId}
                        onChange={(e) => setFormData({ ...formData, goodwillInterestAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="410101">(410101) Loan Interest Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from Goodwill Credit Fees"
                        value={formData.goodwillFeeAccountId}
                        onChange={(e) => setFormData({ ...formData, goodwillFeeAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420109">(420109) Loan Fee Income</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Income from Goodwill Credit Penalty"
                        value={formData.goodwillPenaltyAccountId}
                        onChange={(e) => setFormData({ ...formData, goodwillPenaltyAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="420103">(420103) Loan Penalty Income</option>
                      </FloatingSelect>
                    </div>
                  </div>

                  {/* 3. Expenses */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-[#1072ba] uppercase tracking-wide">
                      Expenses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      <FloatingSelect
                        id="tour-loan-acc-losseswrittenoff"
                        label="Losses written off *"
                        required
                        value={formData.lossesWrittenOffAccountId}
                        onChange={(e) => setFormData({ ...formData, lossesWrittenOffAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="520101">(520101) Loan Write-off Expense</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Expenses from Goodwill Credit"
                        value={formData.goodwillExpenseAccountId}
                        onChange={(e) => setFormData({ ...formData, goodwillExpenseAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="520104">(520104) Loan Goodwill Credit Expense</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="ChargeOff Expense"
                        value={formData.chargeOffExpenseAccountId}
                        onChange={(e) => setFormData({ ...formData, chargeOffExpenseAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="520105">(520105) Loan Charge-off Expense</option>
                      </FloatingSelect>

                      <FloatingSelect
                        label="Charge Off Fraud Expense"
                        value={formData.chargeOffFraudExpenseAccountId}
                        onChange={(e) => setFormData({ ...formData, chargeOffFraudExpenseAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="520106">(520106) Loan Fraud Charge-off Expense</option>
                      </FloatingSelect>
                    </div>
                  </div>

                  {/* 4. Liabilities */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-[#1072ba] uppercase tracking-wide">
                      Liabilities
                    </h3>
                    <div className="w-full md:w-1/2">
                      <FloatingSelect
                        id="tour-loan-acc-overpayment"
                        label="Over payment liability *"
                        required
                        value={formData.overpaymentLiabilityAccountId}
                        onChange={(e) => setFormData({ ...formData, overpaymentLiabilityAccountId: e.target.value })}
                      >
                        <option value=""> </option>
                        <option value="220202">(220202) Loan Overpayment Liability</option>
                      </FloatingSelect>
                    </div>
                  </div>

                  {/* 5. Advanced Accounting Rules */}
                  <div className="pt-3 border-t border-gray-100 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tour-loan-acc-advanced"
                      checked={formData.advancedAccountingRules}
                      onChange={(e) => setFormData({ ...formData, advancedAccountingRules: e.target.checked })}
                      className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="tour-loan-acc-advanced" className="text-xs text-gray-700 cursor-pointer select-none">
                      Advanced Accounting Rules
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-accounting-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 7: PREVIEW */}
        {currentStep === 7 && (
          <div id="tour-loan-preview-card" className="space-y-6 pt-2">
            <div className="border border-gray-200 rounded-[2px] p-6 space-y-6 bg-white text-xs">
              
              {/* Section 1: Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#1072ba]">
                  Details
                </h3>
                <div className="space-y-1.5 divide-y divide-gray-50">
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Name:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.name || 'TKB Personal Loan'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Short Name:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.shortName || 'TKPL'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">External Id:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.externalId || 'TKB-PRD-PL-001'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Include in Customer Loan Counter:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.includeInLoanCounter ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Description:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.description || 'Personal installment loan with monthly repayments and declining balance interest calculation.'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Currency */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">
                  Currency
                </h3>
                <div className="space-y-1.5 divide-y divide-gray-50">
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Currency:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.currency ? `${formData.currency} [VND]` : 'Vietnamese Dong [VND]'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Decimal Places:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.decimalPlaces !== '' ? formData.decimalPlaces : '0'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Currency in multiples of:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.currencyMultiplesOf || '1'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Installment in multiples of:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.installmentMultiplesOf || '1'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Terms */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">
                  Terms
                </h3>
                <div className="space-y-1.5 divide-y divide-gray-50">
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Principal:</span>
                    <span className="col-span-7 text-gray-900 font-normal">
                      {Number(formData.defaultPrincipal || 10000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Min: {Number(formData.minPrincipal || 5000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Max: {Number(formData.maxPrincipal || 50000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Allow Approved / Disbursed Amounts Over Applied:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.allowDisbursalAboveApplied ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Installment day calculation from:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.installmentDayCalculationFrom || 'Disbursement Date'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Repayments:</span>
                    <span className="col-span-7 text-gray-900 font-normal">
                      {formData.defaultRepayments || '12'} (Min: {formData.minRepayments || '6'}, Max: {formData.maxRepayments || '24'})
                    </span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Linked to floating interest rates:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.isLinkedToFloatingInterestRates ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Nominal interest rate:</span>
                    <span className="col-span-7 text-gray-900 font-normal">
                      {formData.defaultInterestRate || '12'} (Min: {formData.minInterestRate || '10'}, Max: {formData.maxInterestRate || '16'}) {formData.interestRateFrequency || 'Per year'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Terms vary based on loan cycle:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.termsVaryBasedOnLoanCycle ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Repay Every:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.repaidEveryFrequency || '1'} {formData.repaidEveryFrequencyType || 'Months'}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Settings */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">
                  Settings
                </h3>
                <div className="space-y-1.5 divide-y divide-gray-50">
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Amortization:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.amortization || 'Equal installments'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Is Equal Amortization?:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.isEqualAmortization ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Interest Method:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.interestMethod || 'Declining Balance'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Interest Calculation Period:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.interestCalculationPeriod || 'Daily'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Repayment strategy:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.repaymentStrategy || 'Interest, Principal, Penalties, Fees Order'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Loan Schedule Type:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.loanScheduleType || 'Cumulative'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Enable Multiple Disbursals:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.enableMultipleDisbursals ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Place Guarantee Funds On-Hold:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.placeGuaranteeFundsOnHold ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Arrears tolerance:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.arrearsTolerance !== '' ? formData.arrearsTolerance : '0'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Days in year:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.daysInYear || '365 Days'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Days in month:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.daysInMonth || 'Actual'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Use Global Configuration to the Event (notifications):</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.useGlobalConfigForRepaymentEvent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Due days for repayment event:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.dueDaysForRepaymentEvent || '1'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Overdue days for repayment event:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.overdueDaysForRepaymentEvent || '1'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Overdue days for NPA:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.overdueDaysForNPA || '90'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Account moves out of NPA only after all arrears have been cleared:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.accountMovesOutOfNpa ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-12 py-1">
                    <span className="col-span-5 text-gray-600 font-medium">Allow overriding select terms and settings in loan accounts:</span>
                    <span className="col-span-7 text-gray-900 font-normal">{formData.allowOverridingSelectTerms ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Accounting */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">
                  Accounting
                </h3>
                <div className="grid grid-cols-12 py-1">
                  <span className="col-span-5 text-gray-600 font-medium">Type:</span>
                  <span className="col-span-7 text-gray-900 font-normal">{formData.accountingRule || 'Cash'}</span>
                </div>

                {formData.accountingRule === 'Cash' && (
                  <div className="space-y-4 pl-2">
                    {/* Assets */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Assets
                      </h4>
                      <div className="space-y-1 divide-y divide-gray-50 pl-2">
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Fund source:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(110201) Settlement Bank Account</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Loan portfolio:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(120101) Retail Loan Principal</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Transfer in suspense:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(130101) Clearing Receivable</span>
                        </div>
                      </div>
                    </div>

                    {/* Income */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Income
                      </h4>
                      <div className="space-y-1 divide-y divide-gray-50 pl-2">
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from interest:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(410101) Loan Interest Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from fees:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420109) Loan Fee Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from penalties:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420103) Loan Penalty Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from Recovery Repayments:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420110) Loan Recovery Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from ChargeOff Interest:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(410101) Loan Interest Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from ChargeOff Fees:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420109) Loan Fee Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from ChargeOff Penalty:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420103) Loan Penalty Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from Goodwill Credit Interest:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(410101) Loan Interest Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from Goodwill Credit Fees:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420109) Loan Fee Income</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Income from Goodwill Credit Penalty:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(420103) Loan Penalty Income</span>
                        </div>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Expenses
                      </h4>
                      <div className="space-y-1 divide-y divide-gray-50 pl-2">
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Losses written off:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(520101) Loan Write-off Expense</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Expenses from Goodwill Credit:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(520104) Loan Goodwill Credit Expense</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">ChargeOff Expense:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(520105) Loan Charge-off Expense</span>
                        </div>
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Charge Off Fraud Expense:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(520106) Loan Fraud Charge-off Expense</span>
                        </div>
                      </div>
                    </div>

                    {/* Liabilities */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Liabilities
                      </h4>
                      <div className="space-y-1 divide-y divide-gray-50 pl-2">
                        <div className="grid grid-cols-12 py-0.5">
                          <span className="col-span-5 text-gray-600">Over payment liability:</span>
                          <span className="col-span-7 text-gray-900 font-normal">(220202) Loan Overpayment Liability</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Step Action Buttons matching Image 4 */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={onNavigateLoanProducts}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                id="tour-loan-preview-submit-btn"
                onClick={handleSubmit}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold px-6 py-2 rounded-[2px] transition-colors shadow-xs cursor-pointer select-none"
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
