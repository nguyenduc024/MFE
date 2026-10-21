import React, { useState, useEffect } from 'react';
import { Pencil, Check, Calendar, Trash2, Plus, ChevronDown, X, Info, Eye } from 'lucide-react';

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
  className = ''
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

const DEFAULT_RD_SLAB = {
  periodType: 'Months',
  periodFrom: '1',
  periodTo: '12',
  amountRangeFrom: '',
  amountRangeTo: '',
  interest: '4.0',
  description: 'Goal Savings 12M - 4.0% p.a.'
};

export default function CreateRecurringDepositProductView({
  onNavigateHome,
  onNavigateProducts,
  onNavigateRecurringDepositProducts,
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

  // Form State initialized empty so floating placeholders show initially
  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 1)
    name: '',
    shortName: '',
    description: '',

    // Step 2: CURRENCY (Image 2)
    currency: '',
    decimalPlaces: '',
    currencyMultiplesOf: '',

    // Step 3: TERMS (Image 3)
    minDepositAmount: '',
    defaultDepositAmount: '',
    maxDepositAmount: '',
    interestCompoundingPeriod: '',
    interestPostingPeriod: '',
    interestCalculationUsing: '',
    daysInYear: '',

    // Step 4: SETTINGS (Image 4)
    isMandatoryDeposit: false,
    adjustAdvancePayments: false,
    allowWithdrawals: false,
    lockinPeriodFrequency: '',
    lockinPeriodType: '',
    minDepositTermFrequency: '',
    minDepositTermType: '',
    inMultiplesOfFrequency: '',
    inMultiplesOfType: '',
    maxDepositTermFrequency: '',
    maxDepositTermType: '',
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
    accountingRule: 'Cash',
    savingReferenceAccountId: '110201',
    savingControlAccountId: '210104', // (210104) Recurring Deposits
    transfersInSuspenseAccountId: '220201', // (220201) Clearing Payable
    interestOnSavingsAccountId: '510101', // (510101) Savings Interest Expense
    incomeFromFeeAccountId: '420102', // (420102) Savings Service Fee Income
    incomeFromPenaltyAccountId: '420108', // (420108) Recurring Deposit Penalty Income
    advancedAccountingRules: false
  });

  // Modal State for Add Slab (Image 1)
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
        name: 'TKB Goal Savings',
        shortName: 'TKGS',
        description: 'A recurring deposit product designed to help customers achieve savings goals through regular monthly contributions.'
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
        minDepositAmount: '100000',
        defaultDepositAmount: '500000',
        maxDepositAmount: '10000000',
        interestCompoundingPeriod: 'Monthly',
        interestPostingPeriod: 'Monthly',
        interestCalculationUsing: 'Daily Balance',
        daysInYear: '365 Days'
      }));
    };

    const handleAutofillSettings = () => {
      setFormData(prev => ({
        ...prev,
        isMandatoryDeposit: true,
        adjustAdvancePayments: false,
        allowWithdrawals: false,
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '12',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '',
        inMultiplesOfType: '',
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
        chartName: 'TKB Goal Savings Interest 2026',
        chartFromDate: '10/13/2026',
        chartEndDate: '',
        chartDescription: 'Annual interest rate of 4.0% for TKB Goal Savings with a 12-month deposit term.',
        isPrimaryGroupingByAmount: false,
        slabs: [{ ...DEFAULT_RD_SLAB }]
      }));
    };

    const handleAutofillSlabForm = () => {
      setSlabForm({ ...DEFAULT_RD_SLAB });
    };

    const handleConfirmAddSlab = () => {
      setFormData(prev => ({
        ...prev,
        slabs: [{ ...DEFAULT_RD_SLAB }]
      }));
      setShowSlabModal(false);
    };

    const handleAutofillAccounting = () => {
      setFormData(prev => ({
        ...prev,
        accountingRule: 'Cash',
        savingReferenceAccountId: '110201',
        savingControlAccountId: '210104',
        transfersInSuspenseAccountId: '220201',
        interestOnSavingsAccountId: '510101',
        incomeFromFeeAccountId: '420102',
        incomeFromPenaltyAccountId: '420108',
        advancedAccountingRules: false
      }));
    };

    const handleAutofillAll = () => {
      setFormData({
        name: 'TKB Goal Savings',
        shortName: 'TKGS',
        description: 'A recurring deposit product designed to help customers achieve savings goals through regular monthly contributions.',
        currency: 'Vietnamese Dong',
        decimalPlaces: '0',
        currencyMultiplesOf: '1',
        minDepositAmount: '100000',
        defaultDepositAmount: '500000',
        maxDepositAmount: '10000000',
        interestCompoundingPeriod: 'Monthly',
        interestPostingPeriod: 'Monthly',
        interestCalculationUsing: 'Daily Balance',
        daysInYear: '365 Days',
        isMandatoryDeposit: true,
        adjustAdvancePayments: false,
        allowWithdrawals: false,
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '12',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '',
        inMultiplesOfType: '',
        maxDepositTermFrequency: '12',
        maxDepositTermType: 'Months',
        applyPenalInterest: false,
        penalInterest: '',
        penalInterestPeriod: '',
        isWithholdTaxApplicable: false,
        hasChart: true,
        chartName: 'TKB Goal Savings Interest 2026',
        chartFromDate: '10/13/2026',
        chartEndDate: '',
        chartDescription: 'Annual interest rate of 4.0% for TKB Goal Savings with a 12-month deposit term.',
        isPrimaryGroupingByAmount: false,
        slabs: [{ ...DEFAULT_RD_SLAB }],
        chargeId: '',
        accountingRule: 'Cash',
        savingReferenceAccountId: '110201',
        savingControlAccountId: '210104',
        transfersInSuspenseAccountId: '220201',
        interestOnSavingsAccountId: '510101',
        incomeFromFeeAccountId: '420102',
        incomeFromPenaltyAccountId: '420108',
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
          ...formData,
          id: String(Date.now())
        });
      }
      if (onNavigateRecurringDepositProducts) {
        onNavigateRecurringDepositProducts();
      }
    };

    window.addEventListener('practice-autofill-rd-details', handleAutofillDetails);
    window.addEventListener('practice-autofill-rd-currency', handleAutofillCurrency);
    window.addEventListener('practice-autofill-rd-terms', handleAutofillTerms);
    window.addEventListener('practice-autofill-rd-settings', handleAutofillSettings);
    window.addEventListener('practice-autofill-rd-chart', handleAutofillChart);
    window.addEventListener('practice-autofill-rd-slab-form', handleAutofillSlabForm);
    window.addEventListener('practice-confirm-add-rd-slab', handleConfirmAddSlab);
    window.addEventListener('practice-autofill-rd-accounting', handleAutofillAccounting);
    window.addEventListener('practice-autofill-rd-all', handleAutofillAll);
    window.addEventListener('practice-next-rd-step', handleNextStep);
    window.addEventListener('practice-submit-rd', handleSubmitProduct);

    return () => {
      window.removeEventListener('practice-autofill-rd-details', handleAutofillDetails);
      window.removeEventListener('practice-autofill-rd-currency', handleAutofillCurrency);
      window.removeEventListener('practice-autofill-rd-terms', handleAutofillTerms);
      window.removeEventListener('practice-autofill-rd-settings', handleAutofillSettings);
      window.removeEventListener('practice-autofill-rd-chart', handleAutofillChart);
      window.removeEventListener('practice-autofill-rd-slab-form', handleAutofillSlabForm);
      window.removeEventListener('practice-confirm-add-rd-slab', handleConfirmAddSlab);
      window.removeEventListener('practice-autofill-rd-accounting', handleAutofillAccounting);
      window.removeEventListener('practice-autofill-rd-all', handleAutofillAll);
      window.removeEventListener('practice-next-rd-step', handleNextStep);
      window.removeEventListener('practice-submit-rd', handleSubmitProduct);
    };
  }, [formData, onSaveProduct, onNavigateRecurringDepositProducts]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 8));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddSlabSubmit = (e) => {
    if (e) e.preventDefault();
    const newSlab = {
      periodType: slabForm.periodType || 'Months',
      periodFrom: slabForm.periodFrom || '1',
      periodTo: slabForm.periodTo || '12',
      amountRangeFrom: slabForm.amountRangeFrom || '',
      amountRangeTo: slabForm.amountRangeTo || '',
      interest: slabForm.interest || '4.0',
      description: slabForm.description || 'Goal Savings 12M - 4.0% p.a.'
    };
    setFormData(prev => ({
      ...prev,
      slabs: [...prev.slabs, newSlab]
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSaveProduct) {
      onSaveProduct({
        ...formData,
        id: String(Date.now())
      });
    }
    if (onNavigateRecurringDepositProducts) {
      onNavigateRecurringDepositProducts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1: Create | Home / Products / Recurring Deposit Products / Create */}
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
            onClick={onNavigateRecurringDepositProducts} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Recurring Deposit Products
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header matching Images (8 steps) */}
        <div id="tour-rd-stepper" className="relative flex items-center justify-between px-2 pt-1 pb-4">
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
                {/* Circle Icon: Blue pencil when active, green check when completed, grey pencil when unvisited */}
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
            id="tour-rd-details-form"
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
                id="tour-rd-next-btn"
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
            id="tour-rd-currency-form"
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
                <option value=""></option>
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
                id="tour-rd-next-btn"
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
            id="tour-rd-terms-form"
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
                <option value=""></option>
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
                <option value=""></option>
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
                id="tour-rd-next-btn"
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
            id="tour-rd-settings-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Top row checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMandatoryDeposit}
                  onChange={(e) => setFormData({ ...formData, isMandatoryDeposit: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba] focus:ring-0"
                />
                <span className="font-normal">Is Mandatory Deposit</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.adjustAdvancePayments}
                  onChange={(e) => setFormData({ ...formData, adjustAdvancePayments: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba] focus:ring-0"
                />
                <span className="font-normal">Adjust advance payments toward future installments</span>
              </label>
            </div>

            {/* Second row checkbox */}
            <div>
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowWithdrawals}
                  onChange={(e) => setFormData({ ...formData, allowWithdrawals: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba] focus:ring-0"
                />
                <span className="font-normal">Allow Withdrawals</span>
              </label>
            </div>

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

            {/* For Pre-mature closure */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                For Pre-mature closure
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
                    <option value=""></option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                  </FloatingSelect>
                </div>
              </div>
            </div>

            {/* Is Withhold Tax Applicable */}
            <div>
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
                id="tour-rd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: INTEREST RATE CHART matching Image 5, Image 1 (Modal) & Image 2 (Table) */}
        {currentStep === 5 && (
          <form 
            id="tour-rd-chart-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Top Bar: Title & + Add Button */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">
                Interest Rate Charts
              </h3>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hasChart: true }))}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-1.5 rounded-[3px] flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {formData.hasChart && (
              <div className="bg-[#fafbfc] border border-gray-200 rounded-[3px] p-6 space-y-6">
                
                {/* Row 1: Name, Start Date, End Date, Trash Icon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 relative">
                  <FloatingInput
                    label="Name *"
                    required
                    value={formData.chartName}
                    onChange={(e) => setFormData({ ...formData, chartName: e.target.value })}
                  />

                  <div className="relative">
                    <FloatingInput
                      label="Start Date *"
                      required
                      value={formData.chartFromDate}
                      onChange={(e) => setFormData({ ...formData, chartFromDate: e.target.value })}
                    />
                    <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
                  </div>

                  <div className="relative flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <FloatingInput
                        label="End Date"
                        value={formData.chartEndDate}
                        onChange={(e) => setFormData({ ...formData, chartEndDate: e.target.value })}
                      />
                      <Calendar className="w-4 h-4 text-gray-500 absolute right-1 bottom-2 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasChart: false }))}
                      className="text-red-500 hover:text-red-700 p-1.5 self-end mb-1 cursor-pointer transition-colors"
                      title="Delete Chart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Description & Primary Grouping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
                  <FloatingInput
                    label="Description"
                    value={formData.chartDescription}
                    onChange={(e) => setFormData({ ...formData, chartDescription: e.target.value })}
                  />

                  <div className="pt-3">
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

                {/* + Add Slab Button matching Image 5 */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="tour-rd-add-slab-btn"
                    onClick={() => setShowSlabModal(true)}
                    className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-2 rounded-[3px] flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slab</span>
                  </button>
                </div>

                {/* Slabs Table matching Image 2 */}
                {formData.slabs.length > 0 && (
                  <div className="pt-2 overflow-x-auto border border-gray-200 rounded-[2px] bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                        <tr>
                          <th className="py-2.5 px-4 font-normal">Period</th>
                          <th className="py-2.5 px-4 font-normal">Amount Range</th>
                          <th className="py-2.5 px-4 font-normal">Interest</th>
                          <th className="py-2.5 px-4 font-normal">Description</th>
                          <th className="py-2.5 px-4 font-normal text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.slabs.map((slab, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-gray-800">
                              {slab.periodFrom} - {slab.periodTo} {slab.periodType}
                            </td>
                            <td className="py-2.5 px-4 text-gray-700">
                              {slab.amountRangeFrom && slab.amountRangeTo ? `${slab.amountRangeFrom} - ${slab.amountRangeTo}` : 'null - null'}
                            </td>
                            <td className="py-2.5 px-4 text-gray-800 font-medium">
                              {slab.interest}
                            </td>
                            <td className="py-2.5 px-4 text-gray-600">
                              {slab.description}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center justify-center space-x-3">
                                <button
                                  type="button"
                                  className="text-[#1072ba] hover:text-[#0e619e] p-1 cursor-pointer"
                                  title="Edit Slab"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlab(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                  title="Delete Slab"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="text-[#1072ba] hover:underline flex items-center space-x-1 text-xs cursor-pointer font-medium ml-2"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Incentives</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                id="tour-rd-next-btn"
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
            id="tour-rd-charges-form"
            onSubmit={handleNext} 
            className="space-y-12 pt-2"
          >
            <div className="flex items-center space-x-6 max-w-lg">
              <div className="flex-1">
                <FloatingSelect
                  label="Charge"
                  value={formData.chargeId}
                  onChange={(e) => setFormData({ ...formData, chargeId: e.target.value })}
                >
                  <option value=""></option>
                  <option value="1">Account Opening Fee</option>
                  <option value="2">Early Withdrawal Penalty Fee</option>
                </FloatingSelect>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!formData.chargeId}
                  className="px-4 py-1.5 bg-[#e0e0e0] text-[#a0a0a0] text-xs font-medium rounded-[3px] shadow-2xs disabled:bg-[#e0e0e0] disabled:text-[#a0a0a0] disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
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
                id="tour-rd-next-btn"
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
            id="tour-rd-accounting-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Accounting Rule Radio Options */}
            <div className="flex items-center space-x-6 text-xs text-gray-700 pb-2 border-b border-gray-200">
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
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountingRule"
                  value="Cash"
                  checked={formData.accountingRule === 'Cash'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="text-[#28a745]"
                />
                <span className="font-semibold text-gray-800">Cash</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountingRule"
                  value="Accrual (periodic)"
                  checked={formData.accountingRule === 'Accrual (periodic)'}
                  onChange={(e) => setFormData({ ...formData, accountingRule: e.target.value })}
                  className="text-[#1072ba]"
                />
                <span>Accrual (periodic)</span>
              </label>
            </div>

            {/* Assets */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-gray-800">Assets</h3>
              <div className="max-w-md">
                <FloatingSelect
                  label="Saving reference *"
                  value={formData.savingReferenceAccountId}
                  onChange={(e) => setFormData({ ...formData, savingReferenceAccountId: e.target.value })}
                >
                  <option value="110201">(110201) Settlement Bank Account</option>
                  <option value="110101">(110101) Vault Cash VND</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Liabilities */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-gray-800">Liabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingSelect
                  label="Saving control *"
                  value={formData.savingControlAccountId}
                  onChange={(e) => setFormData({ ...formData, savingControlAccountId: e.target.value })}
                >
                  <option value="210104">(210104) Recurring Deposits</option>
                  <option value="210103">(210103) Fixed Deposits</option>
                  <option value="210101">(210101) Demand Deposits (CASA)</option>
                </FloatingSelect>

                <FloatingSelect
                  label="Savings transfers in suspense *"
                  value={formData.transfersInSuspenseAccountId}
                  onChange={(e) => setFormData({ ...formData, transfersInSuspenseAccountId: e.target.value })}
                >
                  <option value="220201">(220201) Clearing Payable</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-gray-800">Expenses</h3>
              <div className="max-w-md">
                <FloatingSelect
                  label="Interest on savings *"
                  value={formData.interestOnSavingsAccountId}
                  onChange={(e) => setFormData({ ...formData, interestOnSavingsAccountId: e.target.value })}
                >
                  <option value="510101">(510101) Savings Interest Expense</option>
                  <option value="510102">(510102) Fixed Deposit Interest Expense</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Income */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-gray-800">Income</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingSelect
                  label="Income from fees *"
                  value={formData.incomeFromFeeAccountId}
                  onChange={(e) => setFormData({ ...formData, incomeFromFeeAccountId: e.target.value })}
                >
                  <option value="420102">(420102) Savings Service Fee Income</option>
                </FloatingSelect>

                <FloatingSelect
                  label="Income from penalties *"
                  value={formData.incomeFromPenaltyAccountId}
                  onChange={(e) => setFormData({ ...formData, incomeFromPenaltyAccountId: e.target.value })}
                >
                  <option value="420108">(420108) Recurring Deposit Penalty Income</option>
                  <option value="420107">(420107) Fixed Deposit Penalty Income</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Advanced Accounting Rules */}
            <div className="pt-3">
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.advancedAccountingRules}
                  onChange={(e) => setFormData({ ...formData, advancedAccountingRules: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba]"
                />
                <span className="font-semibold text-gray-800">Advanced Accounting Rules</span>
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
                id="tour-rd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 8: PREVIEW matching Image 5 */}
        {currentStep === 8 && (
          <div 
            id="tour-rd-preview-card"
            className="space-y-6 pt-2"
          >
            <div className="border border-gray-200 rounded-[2px] p-6 bg-white space-y-6 text-xs">
              <h2 className="text-base font-semibold text-gray-900 pb-1">
                {formData.name || 'TKB Goal Savings'}
              </h2>

              {/* Details */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Short Name:</span>
                    <span className="col-span-2 text-gray-900">{formData.shortName || 'TKGS'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Description:</span>
                    <span className="col-span-2 text-gray-900">{formData.description || 'A recurring deposit product designed to help customers achieve savings goals through regular monthly contributions.'}</span>
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Currency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Currency:</span>
                    <span className="col-span-2 text-gray-900">{formData.currency || 'Vietnamese Dong'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Decimal Places:</span>
                    <span className="col-span-2 text-gray-900">{formData.decimalPlaces ?? '0'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Currency in multiples of:</span>
                    <span className="col-span-2 text-gray-900">{formData.currencyMultiplesOf || '1'}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Deposit Amount:</span>
                    <span className="col-span-2 text-gray-900">{formData.defaultDepositAmount || '500000'} (Min: {formData.minDepositAmount || '100000'}, Max: {formData.maxDepositAmount || '10000000'})</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Interest Compounding Period:</span>
                    <span className="col-span-2 text-gray-900">{formData.interestCompoundingPeriod || 'Monthly'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Interest Posting Period:</span>
                    <span className="col-span-2 text-gray-900">{formData.interestPostingPeriod || 'Monthly'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Interest Calculated using:</span>
                    <span className="col-span-2 text-gray-900">{formData.interestCalculationUsing || 'Daily Balance'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Days in Year:</span>
                    <span className="col-span-2 text-gray-900">{formData.daysInYear || '365 Days'}</span>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Minimum Deposit Term:</span>
                    <span className="col-span-2 text-gray-900">{formData.minDepositTermFrequency || '12'} Months</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Maximum Deposit Term:</span>
                    <span className="col-span-2 text-gray-900">{formData.maxDepositTermFrequency || '12'} Months</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Apply Penal Interest (less):</span>
                    <span className="col-span-2 text-gray-900">{formData.applyPenalInterest ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Recurring Deposit Type:</span>
                    <span className="col-span-2 text-gray-900">{formData.isMandatoryDeposit ? 'Mandatory' : 'Voluntary'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Withhold Tax is Applicable:</span>
                    <span className="col-span-2 text-gray-900">{formData.isWithholdTaxApplicable ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Interest Rate Charts */}
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Interest Rate Charts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Name:</span>
                    <span className="col-span-2 text-gray-900">{formData.chartName || 'TKB Goal Savings Interest 2026'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">From Date:</span>
                    <span className="col-span-2 text-gray-900">13 October 2026</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-500">Primary Grouping by Amount:</span>
                    <span className="col-span-2 text-gray-900">{formData.isPrimaryGroupingByAmount ? 'Yes' : ''}</span>
                  </div>
                </div>

                {/* Slabs Table in Preview */}
                <div className="overflow-x-auto border border-gray-200 rounded-[2px] mt-2">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                      <tr>
                        <th className="py-2.5 px-4 font-normal">Period</th>
                        <th className="py-2.5 px-4 font-normal">Amount Range</th>
                        <th className="py-2.5 px-4 font-normal">Interest</th>
                        <th className="py-2.5 px-4 font-normal">Description</th>
                        <th className="py-2.5 px-4 font-normal text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(formData.slabs.length > 0 ? formData.slabs : [DEFAULT_RD_SLAB]).map((slab, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-4 text-gray-800">
                            {slab.periodFrom || '1'} - {slab.periodTo || '12'} {slab.periodType || 'Months'}
                          </td>
                          <td className="py-2.5 px-4 text-gray-700">
                            null - null
                          </td>
                          <td className="py-2.5 px-4 text-gray-800 font-medium">
                            4.00 %
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">
                            {slab.description || 'Goal Savings 12M - 4.0% p.a.'}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="text-[#1072ba] inline-flex items-center space-x-1 cursor-pointer hover:underline text-xs">
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Incentives</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accounting */}
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <h3 className="font-semibold text-gray-800 text-xs">Accounting</h3>
                <div className="text-gray-700">
                  <span className="text-gray-500">Type:</span> <span className="text-gray-900 font-medium">Cash</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[#1072ba] font-medium block">Assets</span>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Saving reference:</span>
                      <span className="col-span-2 text-gray-900">(110201) Settlement Bank Account</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#1072ba] font-medium block">Liabilities</span>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Saving control:</span>
                      <span className="col-span-2 text-gray-900">(210104) Recurring Deposits</span>
                    </div>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Savings transfers in suspense:</span>
                      <span className="col-span-2 text-gray-900">(220201) Clearing Payable</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#1072ba] font-medium block">Income</span>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Income from fees:</span>
                      <span className="col-span-2 text-gray-900">(420102) Savings Service Fee Income</span>
                    </div>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Income from penalties:</span>
                      <span className="col-span-2 text-gray-900">(420108) Recurring Deposit Penalty Income</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#1072ba] font-medium block">Expenses</span>
                    <div className="grid grid-cols-3 text-gray-700">
                      <span className="text-gray-500">Interest on savings:</span>
                      <span className="col-span-2 text-gray-900">(510101) Savings Interest Expense</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions matching Image 5 */}
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
                onClick={onNavigateRecurringDepositProducts}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="tour-rd-submit-btn"
                onClick={handleSubmit}
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. Slab Modal matching Image 1 */}
      {showSlabModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div 
            id="tour-rd-slab-modal"
            className="bg-white rounded-[4px] shadow-xl border border-gray-200 w-full max-w-sm p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <h2 className="text-base font-medium text-gray-900">
              Slab
            </h2>

            <form onSubmit={handleAddSlabSubmit} className="space-y-4">
              <FloatingSelect
                label="Period Type *"
                required
                value={slabForm.periodType}
                onChange={(e) => setSlabForm({ ...slabForm, periodType: e.target.value })}
              >
                <option value="Months">Months</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Years">Years</option>
              </FloatingSelect>

              <FloatingInput
                label="Period From *"
                required
                value={slabForm.periodFrom}
                onChange={(e) => setSlabForm({ ...slabForm, periodFrom: e.target.value })}
              />

              <FloatingInput
                label="Period To"
                value={slabForm.periodTo}
                onChange={(e) => setSlabForm({ ...slabForm, periodTo: e.target.value })}
              />

              <FloatingInput
                label="Amount Range From"
                value={slabForm.amountRangeFrom}
                onChange={(e) => setSlabForm({ ...slabForm, amountRangeFrom: e.target.value })}
              />

              <FloatingInput
                label="Amount Range To"
                value={slabForm.amountRangeTo}
                onChange={(e) => setSlabForm({ ...slabForm, amountRangeTo: e.target.value })}
              />

              <FloatingInput
                label="Interest *"
                required
                value={slabForm.interest}
                onChange={(e) => setSlabForm({ ...slabForm, interest: e.target.value })}
              />

              <FloatingInput
                label="Description *"
                required
                value={slabForm.description}
                onChange={(e) => setSlabForm({ ...slabForm, description: e.target.value })}
              />

              {/* Bottom Actions matching Image 1 */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSlabModal(false)}
                  className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[3px] cursor-pointer select-none transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="tour-rd-modal-add-slab-btn"
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
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
