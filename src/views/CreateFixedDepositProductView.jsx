import React, { useState, useEffect } from 'react';
import { Pencil, Check, Calendar, Trash2, Plus, ChevronDown, X, Info } from 'lucide-react';

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
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(placeholder);

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
      <input
        type={type}
        required={required}
        disabled={disabled}
        placeholder={isFloated && placeholder ? placeholder : ''}
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
      <div className="relative flex items-center">
        <select
          required={required}
          disabled={disabled}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 cursor-pointer appearance-none disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}

const DEFAULT_SLABS = [
  {
    periodType: 'Months',
    periodFrom: '1',
    periodTo: '3',
    amountRangeFrom: '',
    amountRangeTo: '',
    interest: '3.5',
    description: 'FD 3M - 3.5% p.a.'
  },
  {
    periodType: 'Months',
    periodFrom: '4',
    periodTo: '6',
    amountRangeFrom: '',
    amountRangeTo: '',
    interest: '4.5',
    description: 'FD 6M - 4.5% p.a.'
  },
  {
    periodType: 'Months',
    periodFrom: '7',
    periodTo: '9',
    amountRangeFrom: '',
    amountRangeTo: '',
    interest: '5.0',
    description: 'FD 9M - 5.0% p.a.'
  },
  {
    periodType: 'Months',
    periodFrom: '10',
    periodTo: '12',
    amountRangeFrom: '',
    amountRangeTo: '',
    interest: '5.5',
    description: 'FD 12M - 5.5% p.a.'
  }
];

export default function CreateFixedDepositProductView({
  onNavigateHome,
  onNavigateProducts,
  onNavigateFixedDepositProducts,
  onSaveProduct
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1 to 8

  const steps = [
    { id: 1, label: 'DETAILS' },
    { id: 2, label: 'CURRENCY' },
    { id: 3, label: 'TERMS' },
    { id: 4, label: 'SETTINGS' },
    { id: 5, label: 'INTEREST RATE CHART' },
    { id: 6, label: 'CHARGES' },
    { id: 7, label: 'ACCOUNTING' },
    { id: 8, label: 'PREVIEW' }
  ];

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 1)
    name: '',
    shortName: '',
    description: '',

    // Step 2: CURRENCY (Image 2)
    currency: 'Vietnamese Dong',
    decimalPlaces: '0',
    currencyMultiplesOf: '1',

    // Step 3: TERMS (Image 3)
    minDepositAmount: '',
    defaultDepositAmount: '',
    maxDepositAmount: '',
    interestCompoundingPeriod: 'Monthly',
    interestPostingPeriod: 'Monthly',
    interestCalculationUsing: 'Daily Balance',
    daysInYear: '365 Days',

    // Step 4: SETTINGS (Image 4)
    lockinPeriodFrequency: '',
    lockinPeriodType: '',
    minDepositTermFrequency: '',
    minDepositTermType: 'Months',
    inMultiplesOfFrequency: '',
    inMultiplesOfType: 'Months',
    maxDepositTermFrequency: '',
    maxDepositTermType: 'Months',
    applyPenalInterest: false,
    penalInterest: '',
    penalInterestPeriod: '',
    isWithholdTaxApplicable: false,

    // Step 5: INTEREST RATE CHART (Image 5 & Image 1, 2)
    hasChart: true,
    chartName: '',
    chartFromDate: '',
    chartEndDate: '',
    chartDescription: '',
    isPrimaryGroupingByAmount: false,
    slabs: [],

    // Step 6: CHARGES (Image 3)
    chargeId: '',

    // Step 7: ACCOUNTING (Image 4)
    accountingRule: 'Cash', // None | Cash | PeriodicAccrual
    savingReferenceAccountId: '110201', // (110201) Settlement Bank Account
    savingControlAccountId: '210103', // (210103) Fixed Deposits
    transfersInSuspenseAccountId: '220201', // (220201) Clearing Payable
    interestOnSavingsAccountId: '510102', // (510102) Fixed Deposit Interest Expense
    incomeFromFeeAccountId: '420102', // (420102) Savings Service Fee Income
    incomeFromPenaltyAccountId: '420107', // (420107) Fixed Deposit Penalty Income
    advancedAccountingRules: false
  });

  // Modal State for Add Slab
  const [showSlabModal, setShowSlabModal] = useState(false);
  const [slabForm, setSlabForm] = useState({
    periodType: 'Months',
    periodFrom: '',
    periodTo: '',
    amountRangeFrom: '',
    amountRangeTo: '',
    interest: '',
    description: ''
  });

  // Practice event listeners
  useEffect(() => {
    const handleAutofillDetails = () => {
      setFormData(prev => ({
        ...prev,
        name: 'TKB Fixed Deposit',
        shortName: 'TKFD',
        description: 'A VND fixed term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates. Designed for secure savings interest revenue, with maturity-based withdrawal.'
      }));
    };

    const handleAutofillCurrency = () => {
      setFormData(prev => ({
        ...prev,
        currency: 'Vietnamese Dong',
        decimalPlaces: '0',
        currencyMultiplesOf: '1'
      }));
    };

    const handleAutofillTerms = () => {
      setFormData(prev => ({
        ...prev,
        minDepositAmount: '1000000',
        defaultDepositAmount: '10000000',
        maxDepositAmount: '1000000000',
        interestCompoundingPeriod: 'Monthly',
        interestPostingPeriod: 'Monthly',
        interestCalculationUsing: 'Daily Balance',
        daysInYear: '365 Days'
      }));
    };

    const handleAutofillSettings = () => {
      setFormData(prev => ({
        ...prev,
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '3',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '3',
        inMultiplesOfType: 'Months',
        maxDepositTermFrequency: '12',
        maxDepositTermType: 'Months',
        applyPenalInterest: false,
        penalInterest: '',
        penalInterestPeriod: '',
        isWithholdTaxApplicable: false
      }));
    };

    const handleAutofillChart = () => {
      setFormData(prev => ({
        ...prev,
        hasChart: true,
        chartName: 'TKB FD VND Interest Rates 2026',
        chartFromDate: '9/1/2026',
        chartEndDate: '',
        chartDescription: 'Annual interest rate schedule for TKB Fixed Deposit with 3, 6, 9 and 12-month terms.',
        isPrimaryGroupingByAmount: false,
        slabs: [...DEFAULT_SLABS]
      }));
    };

    const handleAutofillAccounting = () => {
      setFormData(prev => ({
        ...prev,
        accountingRule: 'Cash',
        savingReferenceAccountId: '110201',
        savingControlAccountId: '210103',
        transfersInSuspenseAccountId: '220201',
        interestOnSavingsAccountId: '510102',
        incomeFromFeeAccountId: '420102',
        incomeFromPenaltyAccountId: '420107',
        advancedAccountingRules: false
      }));
    };

    const handleAutofillAll = () => {
      setFormData({
        name: 'TKB Fixed Deposit',
        shortName: 'TKFD',
        description: 'A VND fixed term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates. Designed for secure savings interest revenue, with maturity-based withdrawal.',
        currency: 'Vietnamese Dong',
        decimalPlaces: '0',
        currencyMultiplesOf: '1',
        minDepositAmount: '1000000',
        defaultDepositAmount: '10000000',
        maxDepositAmount: '1000000000',
        interestCompoundingPeriod: 'Monthly',
        interestPostingPeriod: 'Monthly',
        interestCalculationUsing: 'Daily Balance',
        daysInYear: '365 Days',
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '3',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '3',
        inMultiplesOfType: 'Months',
        maxDepositTermFrequency: '12',
        maxDepositTermType: 'Months',
        applyPenalInterest: false,
        penalInterest: '',
        penalInterestPeriod: '',
        isWithholdTaxApplicable: false,
        hasChart: true,
        chartName: 'TKB FD VND Interest Rates 2026',
        chartFromDate: '9/1/2026',
        chartEndDate: '',
        chartDescription: 'Annual interest rate schedule for TKB Fixed Deposit with 3, 6, 9 and 12-month terms.',
        isPrimaryGroupingByAmount: false,
        slabs: [...DEFAULT_SLABS],
        chargeId: '',
        accountingRule: 'Cash',
        savingReferenceAccountId: '110201',
        savingControlAccountId: '210103',
        transfersInSuspenseAccountId: '220201',
        interestOnSavingsAccountId: '510102',
        incomeFromFeeAccountId: '420102',
        incomeFromPenaltyAccountId: '420107',
        advancedAccountingRules: false
      });
      setCurrentStep(8);
    };

    const handleNextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, 8));
    };

    const handleSubmitProduct = () => {
      if (onSaveProduct) {
        onSaveProduct({
          id: String(Date.now()),
          name: formData.name || 'TKB Fixed Deposit',
          shortName: formData.shortName || 'TKFD',
          description: formData.description,
          currency: formData.currency,
          status: 'Active',
          slabs: formData.slabs.length > 0 ? formData.slabs : DEFAULT_SLABS,
          accountingRule: formData.accountingRule
        });
      }
      if (onNavigateFixedDepositProducts) onNavigateFixedDepositProducts();
    };

    window.addEventListener('practice-autofill-fd-details', handleAutofillDetails);
    window.addEventListener('practice-autofill-fd-currency', handleAutofillCurrency);
    window.addEventListener('practice-autofill-fd-terms', handleAutofillTerms);
    window.addEventListener('practice-autofill-fd-settings', handleAutofillSettings);
    window.addEventListener('practice-autofill-fd-chart', handleAutofillChart);
    window.addEventListener('practice-autofill-fd-accounting', handleAutofillAccounting);
    window.addEventListener('practice-autofill-fd-all', handleAutofillAll);
    window.addEventListener('practice-next-fd-step', handleNextStep);
    window.addEventListener('practice-submit-fd', handleSubmitProduct);

    return () => {
      window.removeEventListener('practice-autofill-fd-details', handleAutofillDetails);
      window.removeEventListener('practice-autofill-fd-currency', handleAutofillCurrency);
      window.removeEventListener('practice-autofill-fd-terms', handleAutofillTerms);
      window.removeEventListener('practice-autofill-fd-settings', handleAutofillSettings);
      window.removeEventListener('practice-autofill-fd-chart', handleAutofillChart);
      window.removeEventListener('practice-autofill-fd-accounting', handleAutofillAccounting);
      window.removeEventListener('practice-autofill-fd-all', handleAutofillAll);
      window.removeEventListener('practice-next-fd-step', handleNextStep);
      window.removeEventListener('practice-submit-fd', handleSubmitProduct);
    };
  }, [formData, onSaveProduct, onNavigateFixedDepositProducts]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 8));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddSlabSubmit = (e) => {
    if (e) e.preventDefault();
    if (!slabForm.periodFrom || !slabForm.interest || !slabForm.description) return;
    setFormData(prev => ({
      ...prev,
      slabs: [...prev.slabs, { ...slabForm }]
    }));
    setSlabForm({
      periodType: 'Months',
      periodFrom: '',
      periodTo: '',
      amountRangeFrom: '',
      amountRangeTo: '',
      interest: '',
      description: ''
    });
    setShowSlabModal(false);
  };

  const handleRemoveSlab = (index) => {
    setFormData(prev => ({
      ...prev,
      slabs: prev.slabs.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1: Create | Home / Products / Fixed Deposit Products / Create */}
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
            onClick={onNavigateFixedDepositProducts} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Fixed Deposit Products
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header matching Images (8 steps) */}
        <div id="tour-fd-stepper" className="relative flex items-center justify-between px-2 pt-1 pb-4">
          <div className="absolute left-6 right-6 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {steps.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <div 
                key={st.id}
                onClick={() => {
                  if (isCompleted || (formData.name && formData.shortName)) {
                    setCurrentStep(st.id);
                  }
                }}
                className={`flex flex-col items-center z-10 cursor-pointer ${
                  isActive ? 'px-1 py-1 -my-1 rounded-[2px]' : ''
                }`}
              >
                {/* Circle Icon */}
                {isActive ? (
                  <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                    <Pencil className="w-3.5 h-3.5" />
                  </div>
                ) : isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#808080] text-white flex items-center justify-center shadow-2xs">
                    <Pencil className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Step Label */}
                <span className={`text-[9.5px] font-semibold tracking-wider mt-1.5 uppercase text-center ${
                  isActive ? 'text-gray-900 font-bold' : 'text-gray-500'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab 1: DETAILS matching Image 1 */}
        {currentStep === 1 && (
          <form 
            id="tour-fd-details-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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

            <div className="pt-2">
              <FloatingInput
                label="Description *"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                disabled
                className="px-5 py-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-[3px] cursor-not-allowed select-none"
              >
                Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: CURRENCY matching Image 2 */}
        {currentStep === 2 && (
          <form 
            id="tour-fd-currency-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Currency *"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="Vietnamese Dong">Vietnamese Dong</option>
                <option value="US Dollar">US Dollar</option>
                <option value="Euro">Euro</option>
              </FloatingSelect>

              <FloatingInput
                label="Decimal Places *"
                required
                type="number"
                value={formData.decimalPlaces}
                onChange={(e) => setFormData({ ...formData, decimalPlaces: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingInput
                label="Currency in multiples of"
                type="number"
                value={formData.currencyMultiplesOf}
                onChange={(e) => setFormData({ ...formData, currencyMultiplesOf: e.target.value })}
              />
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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: TERMS matching Image 3 */}
        {currentStep === 3 && (
          <form 
            id="tour-fd-terms-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div>
              <h3 className="text-xs font-semibold text-gray-800 mb-3">
                Deposit Amount
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <FloatingInput
                  label="Minimum"
                  value={formData.minDepositAmount}
                  onChange={(e) => setFormData({ ...formData, minDepositAmount: e.target.value })}
                />
                <FloatingInput
                  label="Default *"
                  required
                  value={formData.defaultDepositAmount}
                  onChange={(e) => setFormData({ ...formData, defaultDepositAmount: e.target.value })}
                />
                <FloatingInput
                  label="Maximum"
                  value={formData.maxDepositAmount}
                  onChange={(e) => setFormData({ ...formData, maxDepositAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingSelect
                label="Interest Compounding Period *"
                required
                value={formData.interestCompoundingPeriod}
                onChange={(e) => setFormData({ ...formData, interestCompoundingPeriod: e.target.value })}
              >
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Posting Period *"
                required
                value={formData.interestPostingPeriod}
                onChange={(e) => setFormData({ ...formData, interestPostingPeriod: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="BiAnnual">BiAnnual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingSelect
                label="Interest Calculated using *"
                required
                value={formData.interestCalculationUsing}
                onChange={(e) => setFormData({ ...formData, interestCalculationUsing: e.target.value })}
              >
                <option value="Daily Balance">Daily Balance</option>
                <option value="Average Daily Balance">Average Daily Balance</option>
              </FloatingSelect>

              <FloatingSelect
                label="Days in Year *"
                required
                value={formData.daysInYear}
                onChange={(e) => setFormData({ ...formData, daysInYear: e.target.value })}
              >
                <option value="360 Days">360 Days</option>
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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: SETTINGS matching Image 4 */}
        {currentStep === 4 && (
          <form 
            id="tour-fd-settings-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Lock-in Period ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Lock-in Period ?
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
                  <option value="">Select Type</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Minimum Deposit Term ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Minimum Deposit Term ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Frequency *"
                  required
                  value={formData.minDepositTermFrequency}
                  onChange={(e) => setFormData({ ...formData, minDepositTermFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Frequency Type *"
                  required
                  value={formData.minDepositTermType}
                  onChange={(e) => setFormData({ ...formData, minDepositTermType: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* And thereafter, in Multiples of ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                And thereafter, in Multiples of ?
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
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Maximum Deposit Term ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Maximum Deposit Term ?
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
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* For Pre-mature closure ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                For Pre-mature closure ?
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.applyPenalInterest}
                    onChange={(e) => setFormData({ ...formData, applyPenalInterest: e.target.checked })}
                    className="rounded-[2px] border-gray-300 text-[#1072ba]"
                  />
                  <span>Apply Penal Interest (less)</span>
                </label>

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
                    <option value="">Select Period</option>
                    <option value="Whole Term">Whole Term</option>
                    <option value="Till Premature Date">Till Premature Date</option>
                  </FloatingSelect>
                </div>
              </div>
            </div>

            {/* Withhold Tax */}
            <div className="pt-1">
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isWithholdTaxApplicable}
                  onChange={(e) => setFormData({ ...formData, isWithholdTaxApplicable: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba]"
                />
                <span>Is Withhold Tax Applicable</span>
              </label>
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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: INTEREST RATE CHART matching Image 5, Image 1 & 2 */}
        {currentStep === 5 && (
          <form 
            id="tour-fd-chart-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-700">
                Interest Rate Chart ?
              </h3>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hasChart: true }))}
                className="px-3.5 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Chart Box Container */}
            {formData.hasChart && (
              <div className="border border-gray-200 rounded-[2px] p-5 bg-white relative space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasChart: false }))}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                    title="Delete Chart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FloatingInput
                    label="Name *"
                    required
                    value={formData.chartName}
                    onChange={(e) => setFormData({ ...formData, chartName: e.target.value })}
                  />

                  <div className="relative">
                    <FloatingInput
                      label="From Date *"
                      required
                      placeholder="M/D/YYYY"
                      value={formData.chartFromDate}
                      onChange={(e) => setFormData({ ...formData, chartFromDate: e.target.value })}
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 bottom-2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <FloatingInput
                      label="End Date"
                      placeholder="M/D/YYYY"
                      value={formData.chartEndDate}
                      onChange={(e) => setFormData({ ...formData, chartEndDate: e.target.value })}
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 bottom-2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-center pt-2">
                  <div className="md:col-span-2">
                    <FloatingInput
                      label="Description *"
                      required
                      value={formData.chartDescription}
                      onChange={(e) => setFormData({ ...formData, chartDescription: e.target.value })}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPrimaryGroupingByAmount}
                        onChange={(e) => setFormData({ ...formData, isPrimaryGroupingByAmount: e.target.checked })}
                        className="rounded-[2px] border-gray-300 text-[#1072ba]"
                      />
                      <span>Is primary grouping by amount?</span>
                    </label>
                  </div>
                </div>

                {/* Slabs Section matching Image 2 */}
                {formData.slabs && formData.slabs.length > 0 ? (
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Period</th>
                            <th className="py-2.5 px-3">Amount Range</th>
                            <th className="py-2.5 px-3">Interest</th>
                            <th className="py-2.5 px-3">Description</th>
                            <th className="py-2.5 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formData.slabs.map((slab, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="py-2.5 px-3 text-gray-800 font-medium">
                                {slab.periodFrom} - {slab.periodTo} {slab.periodType}
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 font-mono">
                                {slab.amountRangeFrom && slab.amountRangeTo 
                                  ? `${slab.amountRangeFrom} - ${slab.amountRangeTo}` 
                                  : '-'}
                              </td>
                              <td className="py-2.5 px-3 text-gray-900 font-semibold font-mono">
                                {slab.interest}%
                              </td>
                              <td className="py-2.5 px-3 text-gray-700">
                                {slab.description}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    type="button"
                                    className="text-[#1072ba] hover:underline text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                                  >
                                    <Info className="w-3 h-3" />
                                    <span>View Incentives</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSlab(idx)}
                                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                                    title="Delete slab"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Button to add more slabs */}
                    <div className="flex justify-start">
                      <button
                        type="button"
                        id="tour-fd-add-slab-btn"
                        onClick={() => setShowSlabModal(true)}
                        className="px-3.5 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slab</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty state matching Image 5 before slabs added */
                  <div className="pt-3 border-t border-gray-100 flex flex-col items-center justify-center space-y-2 py-4">
                    <button
                      type="button"
                      id="tour-fd-add-slab-btn"
                      onClick={() => setShowSlabModal(true)}
                      className="px-4 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slab</span>
                    </button>

                    <div className="text-xs text-gray-600 font-medium">
                      It is required to add at least one Slab
                    </div>
                  </div>
                )}

              </div>
            )}

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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: CHARGES matching Image 3 */}
        {currentStep === 6 && (
          <form 
            id="tour-fd-charges-form"
            onSubmit={handleNext}
            className="space-y-6 pt-2"
          >
            <div className="flex items-center space-x-4 max-w-lg">
              <div className="flex-1">
                <FloatingSelect
                  label="Charge"
                  value={formData.chargeId}
                  onChange={(e) => setFormData({ ...formData, chargeId: e.target.value })}
                >
                  <option value="">Select Charge</option>
                  <option value="1">Fixed Deposit Account Opening Fee</option>
                  <option value="2">Early Withdrawal Penalty Fee</option>
                </FloatingSelect>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  disabled={!formData.chargeId}
                  className="px-4 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium rounded-[2px] shadow-xs disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="py-8 text-center text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-[2px]">
              No charges configured for this fixed deposit product. (Tab charge không bắt buộc vì không có phí).
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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 7: ACCOUNTING matching Image 4 */}
        {currentStep === 7 && (
          <form 
            id="tour-fd-accounting-form"
            onSubmit={handleNext}
            className="space-y-6 pt-2"
          >
            {/* Accounting Rule Radio Buttons */}
            <div className="flex items-center space-x-6 text-xs text-gray-800">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountingRule"
                  value="None"
                  checked={formData.accountingRule === 'None'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="text-[#1072ba]"
                />
                <span>None</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-medium text-gray-900">
                <input
                  type="radio"
                  name="accountingRule"
                  value="Cash"
                  checked={formData.accountingRule === 'Cash'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="text-[#1072ba]"
                />
                <span>Cash</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountingRule"
                  value="PeriodicAccrual"
                  checked={formData.accountingRule === 'PeriodicAccrual'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="text-[#1072ba]"
                />
                <span>Accrual (periodic)</span>
              </label>
            </div>

            {formData.accountingRule === 'Cash' && (
              <div className="space-y-6 pt-2">
                
                {/* Assets Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Assets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FloatingSelect
                      label="Saving reference *"
                      required
                      value={formData.savingReferenceAccountId}
                      onChange={(e) => setFormData({ ...formData, savingReferenceAccountId: e.target.value })}
                    >
                      <option value="110201">(110201) Settlement Bank Account</option>
                      <option value="110101">(110101) Vault Cash</option>
                      <option value="110102">(110102) Petty Cash</option>
                    </FloatingSelect>
                  </div>
                </div>

                {/* Liabilities Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Liabilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FloatingSelect
                      label="Saving control *"
                      required
                      value={formData.savingControlAccountId}
                      onChange={(e) => setFormData({ ...formData, savingControlAccountId: e.target.value })}
                    >
                      <option value="210103">(210103) Fixed Deposits</option>
                      <option value="210102">(210102) Current Account Deposits</option>
                    </FloatingSelect>

                    <FloatingSelect
                      label="Savings transfers in suspense *"
                      required
                      value={formData.transfersInSuspenseAccountId}
                      onChange={(e) => setFormData({ ...formData, transfersInSuspenseAccountId: e.target.value })}
                    >
                      <option value="220201">(220201) Clearing Payable</option>
                      <option value="220101">(220101) Inter-branch Clearing</option>
                    </FloatingSelect>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Expenses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FloatingSelect
                      label="Interest on savings *"
                      required
                      value={formData.interestOnSavingsAccountId}
                      onChange={(e) => setFormData({ ...formData, interestOnSavingsAccountId: e.target.value })}
                    >
                      <option value="510102">(510102) Fixed Deposit Interest Expense</option>
                      <option value="510101">(510101) Current Account Interest Expense</option>
                    </FloatingSelect>
                  </div>
                </div>

                {/* Income Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Income
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <FloatingSelect
                      label="Income from fees *"
                      required
                      value={formData.incomeFromFeeAccountId}
                      onChange={(e) => setFormData({ ...formData, incomeFromFeeAccountId: e.target.value })}
                    >
                      <option value="420102">(420102) Savings Service Fee Income</option>
                      <option value="420101">(420101) Account Maintenance Fee Income</option>
                    </FloatingSelect>

                    <FloatingSelect
                      label="Income from penalties *"
                      required
                      value={formData.incomeFromPenaltyAccountId}
                      onChange={(e) => setFormData({ ...formData, incomeFromPenaltyAccountId: e.target.value })}
                    >
                      <option value="420107">(420107) Fixed Deposit Penalty Income</option>
                      <option value="420104">(420104) Late Payment Penalty Fee Income</option>
                    </FloatingSelect>
                  </div>
                </div>

                {/* Advanced Accounting Rules */}
                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.advancedAccountingRules}
                      onChange={(e) => setFormData({ ...formData, advancedAccountingRules: e.target.checked })}
                      className="rounded-[2px] border-gray-300 text-[#1072ba]"
                    />
                    <span>Advanced Accounting Rules</span>
                  </label>
                </div>

              </div>
            )}

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
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 8: PREVIEW matching Image 5 */}
        {currentStep === 8 && (
          <div id="tour-fd-preview-card" className="space-y-6 pt-1">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
              {formData.name || 'TKB Fixed Deposit'}
            </h2>

            {/* Details Card */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Short Name: </span>
                  <span className="text-gray-900 font-semibold">{formData.shortName || 'TKFD'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Description: </span>
                  <span className="text-gray-800">{formData.description}</span>
                </div>
              </div>
            </div>

            {/* Currency Card */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Currency
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Currency: </span>
                  <span className="text-gray-900 font-medium">{formData.currency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Decimal Places: </span>
                  <span className="text-gray-900 font-medium">{formData.decimalPlaces}</span>
                </div>
                <div>
                  <span className="text-gray-500">Currency in multiples of: </span>
                  <span className="text-gray-900 font-medium">{formData.currencyMultiplesOf}</span>
                </div>
              </div>
            </div>

            {/* Terms Card */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Deposit Amount: </span>
                  <span className="text-gray-900 font-medium">
                    {formData.defaultDepositAmount || '10000000'} (Min: {formData.minDepositAmount || '1000000'}, Max: {formData.maxDepositAmount || '1000000000'})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Interest Compounding Period: </span>
                  <span className="text-gray-900 font-medium">{formData.interestCompoundingPeriod}</span>
                </div>
                <div>
                  <span className="text-gray-500">Interest Posting Period: </span>
                  <span className="text-gray-900 font-medium">{formData.interestPostingPeriod}</span>
                </div>
                <div>
                  <span className="text-gray-500">Interest Calculated using: </span>
                  <span className="text-gray-900 font-medium">{formData.interestCalculationUsing}</span>
                </div>
                <div>
                  <span className="text-gray-500">Days in Year: </span>
                  <span className="text-gray-900 font-medium">{formData.daysInYear}</span>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Minimum Deposit Term: </span>
                  <span className="text-gray-900 font-medium">{formData.minDepositTermFrequency} {formData.minDepositTermType}</span>
                </div>
                <div>
                  <span className="text-gray-500">And thereafter in Multiples of: </span>
                  <span className="text-gray-900 font-medium">{formData.inMultiplesOfFrequency || '3'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Maximum Deposit Term: </span>
                  <span className="text-gray-900 font-medium">{formData.maxDepositTermFrequency} {formData.maxDepositTermType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Apply Penal Interest: </span>
                  <span className="text-gray-900 font-medium">{formData.applyPenalInterest ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Withhold Tax: </span>
                  <span className="text-gray-900 font-medium">{formData.isWithholdTaxApplicable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Interest Rate Charts Card matching Image 5 */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Interest Rate Charts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Name: </span>
                  <span className="text-gray-900 font-medium">{formData.chartName || 'TKB FD VND Interest Rates 2026'}</span>
                </div>
                <div>
                  <span className="text-gray-500">From Date: </span>
                  <span className="text-gray-900 font-medium">01 September 2026</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Description: </span>
                  <span className="text-gray-800">{formData.chartDescription}</span>
                </div>
                <div>
                  <span className="text-gray-500">Primary Grouping by Amount: </span>
                  <span className="text-gray-900 font-medium">{formData.isPrimaryGroupingByAmount ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Slabs Table in Preview */}
              <div className="overflow-x-auto border border-gray-200 rounded-[2px] mt-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Period</th>
                      <th className="py-2 px-3">Amount Range</th>
                      <th className="py-2 px-3">Interest</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(formData.slabs.length > 0 ? formData.slabs : DEFAULT_SLABS).map((s, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-900 font-medium">
                          {s.periodFrom} - {s.periodTo} {s.periodType}
                        </td>
                        <td className="py-2 px-3 text-gray-500 font-mono">
                          {s.amountRangeFrom && s.amountRangeTo ? `${s.amountRangeFrom} - ${s.amountRangeTo}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-gray-900 font-semibold font-mono">
                          {s.interest}
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {s.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accounting Card matching Image 5 */}
            <div className="bg-white border border-gray-200 rounded-[2px] p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5">
                Accounting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Type: </span>
                  <span className="text-gray-900 font-bold">{formData.accountingRule}</span>
                </div>
                <div>
                  <span className="text-gray-500">Saving reference: </span>
                  <span className="text-gray-900 font-medium">(110201) Settlement Bank Account</span>
                </div>
                <div>
                  <span className="text-gray-500">Saving control: </span>
                  <span className="text-gray-900 font-medium">(210103) Fixed Deposits</span>
                </div>
                <div>
                  <span className="text-gray-500">Savings transfers in suspense: </span>
                  <span className="text-gray-900 font-medium">(220201) Clearing Payable</span>
                </div>
                <div>
                  <span className="text-gray-500">Interest on savings: </span>
                  <span className="text-gray-900 font-medium">(510102) Fixed Deposit Interest Expense</span>
                </div>
                <div>
                  <span className="text-gray-500">Income from fees: </span>
                  <span className="text-gray-900 font-medium">(420102) Savings Service Fee Income</span>
                </div>
                <div>
                  <span className="text-gray-500">Income from penalties: </span>
                  <span className="text-gray-900 font-medium">(420107) Fixed Deposit Penalty Income</span>
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
                id="tour-fd-submit-btn"
                onClick={() => {
                  if (onSaveProduct) {
                    onSaveProduct({
                      id: String(Date.now()),
                      name: formData.name || 'TKB Fixed Deposit',
                      shortName: formData.shortName || 'TKFD',
                      description: formData.description,
                      currency: formData.currency,
                      status: 'Active',
                      slabs: formData.slabs.length > 0 ? formData.slabs : DEFAULT_SLABS,
                      accountingRule: formData.accountingRule
                    });
                  }
                  if (onNavigateFixedDepositProducts) onNavigateFixedDepositProducts();
                }}
                className="px-7 py-2.5 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Slab Modal matching Image 1 */}
      {showSlabModal && (
        <div 
          id="tour-fd-slab-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Add Slab
              </h3>
              <button
                type="button"
                onClick={() => setShowSlabModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSlabSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FloatingSelect
                  label="Period Type *"
                  required
                  value={slabForm.periodType}
                  onChange={(e) => setSlabForm({ ...slabForm, periodType: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>

                <FloatingInput
                  label="Period From *"
                  required
                  type="number"
                  value={slabForm.periodFrom}
                  onChange={(e) => setSlabForm({ ...slabForm, periodFrom: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FloatingInput
                  label="Period To"
                  type="number"
                  value={slabForm.periodTo}
                  onChange={(e) => setSlabForm({ ...slabForm, periodTo: e.target.value })}
                />

                <FloatingInput
                  label="Amount Range From"
                  type="number"
                  value={slabForm.amountRangeFrom}
                  onChange={(e) => setSlabForm({ ...slabForm, amountRangeFrom: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FloatingInput
                  label="Amount Range To"
                  type="number"
                  value={slabForm.amountRangeTo}
                  onChange={(e) => setSlabForm({ ...slabForm, amountRangeTo: e.target.value })}
                />

                <FloatingInput
                  label="Interest *"
                  required
                  type="number"
                  step="0.1"
                  value={slabForm.interest}
                  onChange={(e) => setSlabForm({ ...slabForm, interest: e.target.value })}
                />
              </div>

              <div>
                <FloatingInput
                  label="Description *"
                  required
                  value={slabForm.description}
                  onChange={(e) => setSlabForm({ ...slabForm, description: e.target.value })}
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSlabModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[2px] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}